# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :pool, optional: true
  belongs_to :protocol
  belongs_to :smart_contract
  has_many :cryptocurrency_pools, dependent: :destroy

  # === ENUMS ===
  enum category: { farm: 0, trade_pair: 1, yield_optimizer: 2, profit_distributor: 3 }

  # === VALIDATIONS ===
  validates :smart_contract_id, uniqueness: true
end
