# frozen_string_literal: true

class Blockchain < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :smart_contracts, dependent: :restrict_with_exception

  # === ENUMS ===
  enum identifier: { secret_network: 0 }
end
