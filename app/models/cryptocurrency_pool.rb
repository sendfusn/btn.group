# frozen_string_literal: true

class CryptocurrencyPool < ApplicationRecord
  self.table_name = 'cryptocurrencies_pools'

  # === ASSOCIATIONS ===
  belongs_to :cryptocurrency
  belongs_to :pool

  # === ENUMS ===
  enum cryptocurrency_role: { deposit: 0, reward: 1, shares: 2 }

  # === VALIDATIONS ===
  validates :cryptocurrency_role, presence: true
  validates :cryptocurrency_role, uniqueness: { scope: %i[cryptocurrency_id pool_id] }
end
