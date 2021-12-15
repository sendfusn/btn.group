# frozen_string_literal: true

class SwapPath < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :from, class_name: 'Cryptocurrency'
  belongs_to :to, class_name: 'Cryptocurrency'

  # === VALIDATES ===
  validates :swap_path_as_string, uniqueness: { scope: %i[from_id to_id] }
  validates :swap_count, numericality: { greater_than_or_equal_to: 1 }

  # === CALLBACKS ===
  before_save do |swap_path|
    swap_path.swap_path_as_string&.gsub!(/\s+/, '')
  end

  # === Intance methods ===
  def swap_path_as_array
    swap_path_as_string.split(',')
  end
end
