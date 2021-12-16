# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :pool, optional: true
  belongs_to :protocol, optional: true
  belongs_to :smart_contract
  has_many :cryptocurrency_pools, dependent: :destroy
  has_many :cryptocurrencies, through: :cryptocurrency_pools

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
    if pool.category == 'trade_pair' && pool.enabled && pool.enabled_changed?
      CreateSwapPathsJob.perform_later
      CreateArbitragePathsJob.perform_later('BUTT')
      CreateArbitragePathsJob.perform_later('SWBTC')
    end
  end

  after_update do |pool|
    RemoveInvalidSwapPathsJob.perform_later if pool.category == 'trade_pair' && !pool.enabled && pool.enabled_changed?
  end
end
