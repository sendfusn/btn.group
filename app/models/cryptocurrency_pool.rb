# frozen_string_literal: true

class CryptocurrencyPool < ApplicationRecord
  self.table_name = 'cryptocurrencies_pools'

  # === ASSOCIATIONS ===
  belongs_to :cryptocurrency
  belongs_to :pool

  # === ENUMS ===
  enum cryptocurrency_role: { deposit: 0, reward: 1, shares: 2 }

  # === SCOPE ===
  scope :deposit, lambda { where(cryptocurrency_role: :deposit) }

  # === VALIDATIONS ===
  validates :cryptocurrency_role, presence: true
  validates :cryptocurrency_role, uniqueness: { scope: %i[cryptocurrency_id pool_id] }

  # === CALLBACKS ===

  # when the amount is changed, we need to update the total locked in the pool
  after_save do |cp|
    cp.pool.update_total_locked if cp.cryptocurrency_role == 'deposit' && cp.amount.present? && cp.amount_changed?
  end
end
