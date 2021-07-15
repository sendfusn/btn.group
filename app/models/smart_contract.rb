# frozen_string_literal: true

class SmartContract < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :blockchain

  # === VALIDATIONS ===
  validates :address, uniqueness: { case_sensitive: false }
end
