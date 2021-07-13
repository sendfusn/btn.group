# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :smart_contract, optional: true
  has_many :cryptocurrency_pools, dependent: :destroy
end
