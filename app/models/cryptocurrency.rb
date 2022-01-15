# frozen_string_literal: true

class Cryptocurrency < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :blockchain
  belongs_to :smart_contract, optional: true
  has_many :attachments, dependent: :destroy, as: :attachable
  has_many :cryptocurrency_pools, dependent: :restrict_with_exception
  has_many :pools, through: :cryptocurrency_pools

  # === DELEGATES ===
  delegate :address, to: :smart_contract, allow_nil: true

  # === SCOPES ===
  scope :tradeable, lambda {
    joins(:cryptocurrency_pools)
      .where(cryptocurrency_pools: { cryptocurrency_role: 'deposit' })
      .where.not(cryptocurrency_pools: { amount: ['0', nil] })
      .uniq
  }

  # === VALIDATIONS ===
  validates :decimals, presence: true
  validates :decimals, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :smart_contract_id, uniqueness: { allow_nil: true }
  validates :symbol, uniqueness: { case_sensitive: false, scope: [:smart_contract_id] }

  # === CALLBACKS ===
  after_save do |c|
    c.pools.each(&:update_total_locked) if c.price.present? && c.saved_change_to_price?
  end

  before_save do |cryptocurrency|
    cryptocurrency.coin_gecko_id&.downcase!
    cryptocurrency.symbol.upcase!
  end

  # === INSTANCE METHODS ===
  def amount_as_usd(amount)
    amount_with_decimals(amount) * price
  end

  # Leaving out the guard clause for decimals abset so we can see the error
  def amount_with_decimals(amount)
    amount.to_d / 10**decimals
  end

  def label_formatted
    "#{symbol} | #{address}"
  end

  def label_formatted_for_dex_aggregator_select
    label = symbol
    label += " | #{smart_contract.address}" if smart_contract.present?
    label
  end
end
