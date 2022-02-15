# frozen_string_literal: true

class Protocol < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :pools, dependent: :restrict_with_exception
  has_many :swap_paths, dependent: :destroy

  # === ENUMS ===
  enum identifier: { btn_group: 0, secret_swap: 1, sienna: 2 }

  # === VALIDATIONS ===
  validates :identifier, presence: true
  validates :identifier, uniqueness: true
end
