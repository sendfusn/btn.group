# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  # A yield optimizer pool can belong to one farm pool
  # and a farm pool can have many yield optimizer pools
  belongs_to :pool, inverse_of: false, optional: true
  belongs_to :protocol, optional: true
  belongs_to :smart_contract
  has_many :cryptocurrency_pools, dependent: :destroy
  has_many :cryptocurrencies, through: :cryptocurrency_pools
  has_many :pool_swap_paths, dependent: :destroy
  has_many :swap_paths, through: :pool_swap_paths

  # === DELEGATES ===
  delegate :address, to: :smart_contract

  # === ENUMS ===
  enum category: { farm: 0, trade_pair: 1, yield_optimizer: 2, profit_distributor: 3, wrap: 4 }

  # === SCOPES ===
  scope :enabled, lambda { where(enabled: true) }

  # === VALIDATIONS ===
  validates :pool_id, absence: true, unless: :can_belong_to_pool?
  validates :pool_id, presence: true, if: :yield_optimizer?
  validates :enabled, presence: true, if: :pseudo_wrap_pool?
  validates :smart_contract_id, uniqueness: true
  validate :farm_can_only_belong_to_trade_pair, if: :farm?
  validate :yield_optimizer_belongs_to_farm, if: :yield_optimizer?

  # === CALLBACKS ===
  after_save do |pool|
    if pool.trade_pair?
      CreateSwapPathsJob.perform_later if pool.enabled && pool.saved_change_to_enabled?
      pool.swap_paths.find_each(&:destroy!) if !pool.enabled && pool.saved_change_to_enabled?
      SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool.id, 0) if pool.total_locked.present? && pool.saved_change_to_total_locked?
      pool.update_shares_price if pool.saved_change_to_total_locked?
    end
  end

  before_save do |pool|
    # If the other cryptocurrency pool has been updated in the last minute, the second one will trigger all this.
    if pool.will_save_change_to_total_locked? && pool.trade_pair? && pool.cryptocurrency_pools.deposit.where('updated_at > ?', Time.current - 1.minute).count == 1
      pool.enabled = true if !pool.enabled && pool.total_locked.present?
      pool.enabled = false if pool.enabled && pool.total_locked.zero?
    end
  end

  # === INSTANCE METHODS ===
  def deposit_label
    deposit_cryptocurrency_ids = root_pool.cryptocurrency_pools.deposit.pluck(:cryptocurrency_id)
    string = ''
    Cryptocurrency.where(id: deposit_cryptocurrency_ids).order(:id).each_with_index do |cryptocurrency, index|
      string = if index.zero?
        cryptocurrency.symbol
      else
        "#{string}-#{cryptocurrency.symbol}"
      end
    end
    string = "#{string} LP" if deposit_cryptocurrency_ids.length > 1
    string
  end

  def earn_label
    if yield_optimizer?
      deposit_label
    else
      cryptocurrency_pools.reward.first.cryptocurrency.symbol
    end
  end

  def root_pool
    current_pool = self
    current_pool = current_pool.pool while current_pool.pool.present?
    current_pool
  end

  # Investigate getting commision_rate_nom and commission_rate_denom
  def simulate_swap(amount, from_id)
    return unless trade_pair?
    return unless cryptocurrency_pools.deposit.pluck(:cryptocurrency_id).include?(from_id)

    amount = amount.to_d
    pool_from_amount = cryptocurrency_pools.find_by(cryptocurrency_id: from_id).amount.to_d
    if pool_from_amount.zero?
      return_amount = 0
      spread_amount = 0
      commission_amount = 0
    else
      pool_to_amount = cryptocurrency_pools.deposit.where.not(cryptocurrency_id: from_id).first.amount.to_d
      commission_rate_nom = 3
      commission_rate_denom = 1_000
      cp = pool_from_amount * pool_to_amount
      return_amount = pool_to_amount - (cp / (pool_from_amount + amount))
      spread_amount = (amount * pool_to_amount / pool_from_amount) - return_amount
      commission_amount = return_amount * commission_rate_nom / commission_rate_denom
      return_amount -= commission_amount
    end
    { return_amount: return_amount.to_i,
      spread_amount: spread_amount.to_i,
      commission_amount: commission_amount.to_i }
  end

  def update_shares_price
    return unless total_locked&.positive?
    return unless trade_pair?
    return unless (cp = cryptocurrency_pools.shares.first)
    return if cp.amount.blank?

    shares_with_decimals = cp.cryptocurrency.amount_with_decimals(cp.amount)
    return if shares_with_decimals.zero?

    cp.cryptocurrency.update(price: (total_locked / shares_with_decimals).round(2))
  end

  def update_total_locked
    total_locked = 0.0
    cryptocurrency_pools.deposit.find_each do |cp|
      if cp.amount.nil? || cp.cryptocurrency.price.nil?
        total_locked = nil
        break
      else
        total_locked += cp.cryptocurrency.amount_with_decimals(cp.amount) * cp.cryptocurrency.price
      end
    end
    update!(total_locked: total_locked)
  end

  private

    def farm_can_only_belong_to_trade_pair
      errors.add(:farm, 'can only belong to trade pair contract.') if pool && !pool.trade_pair?
    end

    def can_belong_to_pool?
      farm? || yield_optimizer?
    end

    def pseudo_wrap_pool?
      return unless trade_pair?
      return unless cryptocurrency_pools.deposit.count == 2

      token_count = 0
      cryptocurrency_pools.deposit.find_each do |cp|
        token_count += 1 if cp.cryptocurrency.smart_contract.present?
      end
      token_count == 1
    end

    def yield_optimizer_belongs_to_farm
      errors.add(:yield_optimizer, 'must belong to farm contract.') unless pool&.farm?
    end
end
