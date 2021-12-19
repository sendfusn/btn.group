# frozen_string_literal: true

class PoolSwapPath < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :pool
  belongs_to :swap_path, dependent: :destroy

  # === VALIDATES ===
  validates :pool_id, uniqueness: { scope: %i[position swap_path_id] }
end
