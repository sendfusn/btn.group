# frozen_string_literal: true

class SmartContract < ApplicationRecord
  # === ALIAS ATTRIBUTE ===
  alias_attribute :contract_hash, :data_hash

  # === ASSOCIATIONS ===
  belongs_to :blockchain

  # === VALIDATIONS ===
  validates :address, uniqueness: { case_sensitive: false }
  validates :address,
            :label,
            presence: true

  # === INSTANCE METHODS ===
  def label_formatted
    "#{label} - #{address}"
  end
end
