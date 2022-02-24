# frozen_string_literal: true

class Blockchain < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :cryptocurrencies, dependent: :restrict_with_exception
  has_many :smart_contracts, dependent: :restrict_with_exception

  # === ENUMS ===
  enum identifier: { secret_network: 0, cosmos: 1, terra: 2, osmosis: 3, sentinel: 4, near: 5 }

  # === VALIDATIONS ===
  validates :identifier, presence: true
  validates :identifier, uniqueness: true

  # === INSTANCE METHODS ===
  def gas_and_delay_factor
    return unless latest_block_time
    return unless base_block_time

    factor = latest_block_time / base_block_time
    return 1 if factor <= 1
    return factor if (factor % 1).zero?

    if factor % 1 > 0.5
      factor.ceil
    else
      factor.floor + 0.5
    end
  end
end
