# frozen_string_literal: true

class Cryptocurrency < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :smart_contract, optional: true

  # === DELEGATES ===
  delegate :address, to: :smart_contract

  # === VALIDATIONS ===
  validates :decimals, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :smart_contract_id, uniqueness: { allow_nil: true }

  def label_formatted
    "#{name} (#{symbol}) - #{address}"
  end
end
