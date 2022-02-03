# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  # A yield optimizer pool can belong to one farm pool
  # and a farm pool can have many yield optimizer pools
  belongs_to :pool, optional: true
  belongs_to :protocol, optional: true
  belongs_to :smart_contract
  has_many :cryptocurrency_pools, dependent: :destroy
  has_many :cryptocurrencies, through: :cryptocurrency_pools
  has_many :pool_swap_paths, dependent: :destroy
  has_many :swap_paths, through: :pool_swap_paths

  # === ENUMS ===
  enum category: { farm: 0, trade_pair: 1, yield_optimizer: 2, profit_distributor: 3 }

  # === SCOPES ===
  scope :enabled, lambda { where(enabled: true) }

  # === VALIDATIONS ===
  validates :enabled, presence: true, if: :pseudo_wrap_pool?
  validates :smart_contract_id, uniqueness: true

  # === CALLBACKS ===
  after_save do |pool|
    if pool.category == 'trade_pair' && pool.enabled
      CreateSwapPathsJob.perform_later if pool.saved_change_to_enabled?
      SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool.id, 0) if pool.total_locked.present? && pool.saved_change_to_total_locked?
      pool.update(enabled: false) if pool.trade_pair_without_liquidity?
    end
  end

  after_update do |pool|
    pool.swap_paths.destroy_all if pool.category == 'trade_pair' && !pool.enabled && pool.saved_change_to_enabled?
  end

  # === INSTANCE METHODS ===
  # Investigate getting commision_rate_nom and commission_rate_denom
  def simulate_swap(amount, from_id)
    return unless category == 'trade_pair'
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

  def trade_pair_without_liquidity?
    return unless trade_pair?

    cryptocurrency_pools.deposit.where.not(amount: '0').count != 2
  end

  def update_total_locked
    total_locked = 0.0
    cryptocurrency_pools.deposit.find_each do |cp|
      break if cp.amount.nil? || cp.cryptocurrency.price.nil? || cp.cryptocurrency.decimals.nil?

      total_locked += cp.cryptocurrency.amount_with_decimals(cp.amount) * cp.cryptocurrency.price
    end
    update!(total_locked: total_locked)
  end

  private

    def pseudo_wrap_pool?
      return unless trade_pair?
      return unless cryptocurrency_pools.deposit.count == 2

      token_count = 0
      cryptocurrency_pools.deposit.find_each do |cp|
        token_count += 1 if cp.cryptocurrency.smart_contract.present?
      end
      token_count == 1
    end
end
