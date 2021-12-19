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
  scope :trade_pair, lambda { where(category: 1) }

  # === VALIDATIONS ===
  validates :smart_contract_id, uniqueness: true

  # === CALLBACKS ===
  after_destroy do |pool|
    RemoveInvalidSwapPathsJob.perform_later if pool.enabled && pool.category == 'trade_pair'
  end

  after_save do |pool|
    if pool.category == 'trade_pair' && pool.enabled
      if pool.enabled_changed?
        CreateSwapPathsJob.perform_later
        CreateArbitragePathsJob.perform_later('BUTT')
        CreateArbitragePathsJob.perform_later('SWBTC')
        CreateArbitragePathsJob.perform_later('SXMR')
      end
      if pool.total_locked.present? && pool.total_locked_changed?
        pool.swap_paths.each do |swap_path|
          mtv = swap_path.pools.order(:total_locked).last.total_locked
          swap_path.update(maximum_tradeable_value: mtv)
        end
      end
    end
  end

  after_update do |pool|
    RemoveInvalidSwapPathsJob.perform_later if pool.category == 'trade_pair' && !pool.enabled && pool.enabled_changed?
  end

  # === INSTANCE METHODS ===
  def update_total_locked
    total_locked = 0.0
    cryptocurrency_pools.deposit.each do |cp|
      break if cp.amount.nil? || cp.cryptocurrency.price.nil? || cp.cryptocurrency.decimals.nil?

      total_locked += cp.cryptocurrency.amount_with_decimals(cp.amount) * cp.cryptocurrency.price
    end
    update!(total_locked: total_locked)
  end
end
