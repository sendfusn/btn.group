# frozen_string_literal: true

class SmartContract < ApplicationRecord
  # === ALIAS ATTRIBUTE ===
  alias_attribute :contract_hash, :data_hash

  # === ASSOCIATIONS ===
  belongs_to :blockchain

  # === VALIDATIONS ===
  validates :address, uniqueness: { case_sensitive: false }
end
