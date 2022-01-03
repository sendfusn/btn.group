# frozen_string_literal: true

class Blockchain < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :cryptocurrencies, dependent: :restrict_with_exception
  has_many :smart_contracts, dependent: :restrict_with_exception

  # === ENUMS ===
  enum identifier: { secret_network: 0, cosmos: 1, terra: 2, osmosis: 3, sentinel: 4 }

  # === VALIDATIONS ===
  validates :identifier, presence: true
  validates :identifier, uniqueness: true
end
