# frozen_string_literal: true

class Cryptocurrency < ApplicationRecord
  # === VALIDATIONS ===
  validates :decimals, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
end
