# frozen_string_literal: true

class Pool < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :pool, optional: true
  belongs_to :protocol
  belongs_to :smart_contract
  has_many :cryptocurrency_pools, dependent: :destroy
end
