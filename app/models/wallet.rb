# frozen_string_literal: true

class Wallet < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :blockchain

  # === VALIDATIONS ===
  validates :address, presence: true
  validates :address, uniqueness: true
end
