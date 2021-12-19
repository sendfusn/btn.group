# frozen_string_literal: true

class Cryptocurrency < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :blockchain
  belongs_to :smart_contract, optional: true
  has_many :cryptocurrency_pools, dependent: :restrict_with_exception
  has_many :pools, through: :cryptocurrency_pools

  # === DELEGATES ===
  delegate :address, to: :smart_contract, allow_nil: true

  # === SCOPES ===
  scope :secret_network, lambda { where(blockchain: Blockchain.find_by(identifier: 'secret_network')) }
  scope :tradeable, lambda {
    joins(:cryptocurrency_pools)
      .where(cryptocurrency_pools: { cryptocurrency_role: 'deposit' })
      .where.not(cryptocurrency_pools: { amount: ['0', nil] })
      .uniq
  }

  # === VALIDATIONS ===
  validates :decimals, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :smart_contract_id, uniqueness: { allow_nil: true }
  validates :symbol, uniqueness: { case_sensitive: false, scope: [:smart_contract_id] }

  # === CALLBACKS ===
  before_save do |cryptocurrency|
    cryptocurrency.coin_gecko_id = cryptocurrency.coin_gecko_id&.downcase
    cryptocurrency.symbol = cryptocurrency.symbol.upcase
  end

  # === CLASS METHODS ===
  def self.buttcoin
    find_by(symbol: 'BUTT').id
  end

  # === INSTANCE METHODS ===
  def label_formatted
    "#{symbol} / #{name} / #{address}"
  end

  def label_formatted_for_dex_aggregator_select
    label = symbol
    label += " | #{smart_contract.address}" if smart_contract.present?
    label
  end
end
