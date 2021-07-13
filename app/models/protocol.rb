# frozen_string_literal: true

class Protocol < ApplicationRecord
  # === ASSOCIATIONS ===
  has_many :pools, dependent: :restrict_with_exception
end
