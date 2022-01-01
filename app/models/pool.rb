# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
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
  validates :enabled, absence: true, if: :trade_pair_without_liquidity?
  validates :enabled, presence: true, if: :pseudo_wrap_pool?
  validates :smart_contract_id, uniqueness: true

  # === CALLBACKS ===
  after_save do |pool|
    if pool.category == 'trade_pair' && pool.enabled
      if pool.enabled_changed?
        CreateSwapPathsJob.perform_later
        CreateArbitragePathsJob.perform_later('BUTT')
        CreateArbitragePathsJob.perform_later('SBNB(BSC)')
        CreateArbitragePathsJob.perform_later('SWBTC')
        CreateArbitragePathsJob.perform_later('SXMR')
      end
      SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool.id, 0) if pool.total_locked.present? && pool.total_locked_changed?
    end
  end

  after_update do |pool|
    pool.swap_paths.destroy_all if pool.category == 'trade_pair' && !pool.enabled && pool.enabled_changed?
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

  def simulate_swap_reverse(amount, to_id)
    return unless category == 'trade_pair'
    return unless cryptocurrency_pools.deposit.pluck(:cryptocurrency_id).include?(to_id)

    amount = amount.to_d
    pool_from_amount = cryptocurrency_pools.deposit.where.not(cryptocurrency_id: to_id).first.amount.to_d
    pool_to_amount = cryptocurrency_pools.find_by(cryptocurrency_id: to_id).amount.to_d
    commission_rate_nom = 3
    commission_rate_denom = 1_000
    cp = pool_from_amount * pool_to_amount
    one_minus_commission = 1 - (3.to_d / 1_000)
    offer_amount = cp * (1.to_d / (pool_to_amount - amount * (1_000_000_000 / (1_000_000_000 * one_minus_commission)))) - pool_from_amount
    before_commission_deduction = amount * (1_000_000_000 / (1_000_000_000 * one_minus_commission))
    spread_amount = offer_amount * pool_to_amount / pool_from_amount - before_commission_deduction
    commission_amount = before_commission_deduction * commission_rate_nom / commission_rate_denom
    { offer_amount: offer_amount.to_i, spread_amount: spread_amount.to_i, commission_amount: commission_amount.to_i }
  end

  def update_total_locked
    total_locked = 0.0
    cryptocurrency_pools.deposit.each do |cp|
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
      cryptocurrency_pools.deposit.each do |cp|
        token_count += 1 if cp.cryptocurrency.smart_contract.present?
      end
      token_count == 1
    end

    def trade_pair_without_liquidity?
      return unless trade_pair?

      cryptocurrency_pools.deposit.where.not(amount: '0').count != 2
    end
end
