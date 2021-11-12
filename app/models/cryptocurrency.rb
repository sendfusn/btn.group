# frozen_string_literal: true

class Cryptocurrency < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :blockchain
  belongs_to :smart_contract, optional: true
  has_many :cryptocurrency_pools, dependent: :restrict_with_exception

  # === DELEGATES ===
  delegate :address, to: :smart_contract, allow_nil: true

  # === SCOPES ===
  scope :secret_network, lambda { where(blockchain: Blockchain.find_by(identifier: 'secret_network')) }
  scope :tradeable, lambda {
    joins(:cryptocurrency_pools)
      .where(cryptocurrency_pools: { cryptocurrency_role: 'deposit' })
      .where.not(cryptocurrency_pools: { total: ['0', nil] })
      .uniq
  }

  # === VALIDATIONS ===
  validates :decimals, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :smart_contract_id, uniqueness: { allow_nil: true }

  # === INSTANCE METHODS ===
  def label_formatted
    "#{symbol} / #{name} / #{address}"
  end
end
