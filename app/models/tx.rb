# frozen_string_literal: true

class Tx < ApplicationRecord
  self.table_name = 'txs'

  # === ASSOCIATIONS ===
  belongs_to :cryptocurrency
  belongs_to :from, polymorphic: true
  belongs_to :to, polymorphic: true

  # === VALIDATIONS ===
  validates :identifier, presence: true
  validates :identifier, uniqueness: { scope: [:cryptocurrency_id] }
end
