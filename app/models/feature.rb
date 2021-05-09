# frozen_string_literal: true

class Feature < ApplicationRecord
  # === FRIENDY ID ===
  extend FriendlyId
  friendly_id :name, use: :slugged

  # === ENUMS ===
  enum blockchain: { secret_network: 0 }

  # === VALIDATIONS ===
  validates :name, presence: true
end
