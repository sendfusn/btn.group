# frozen_string_literal: true

class Protocol < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :pools, dependent: :restrict_with_exception

  # === ENUMS ===
  enum identifier: { btn_group: 0, secret_swap: 1 }

  # === VALIDATIONS ===
  validates :identifier, presence: true
end
