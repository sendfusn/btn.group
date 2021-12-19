# frozen_string_literal: true

class SwapPath < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :from, class_name: 'Cryptocurrency'
  belongs_to :to, class_name: 'Cryptocurrency'
  has_many :pool_swap_paths, dependent: :destroy
  has_many :pools, through: :pool_swap_paths

  # === VALIDATES ===
  validates :swap_path_as_string, uniqueness: { scope: %i[from_id to_id] }
  validates :swap_count, numericality: { greater_than_or_equal_to: 1 }

  # === CALLBACKS ===
  after_create do |swap_path|
    swap_path.swap_path_as_array.each_with_index do |pool_id, index|
      swap_path.pool_swap_paths.create(pool_id: pool_id, position: index)
    end
  end

  before_save do |swap_path|
    swap_path.swap_path_as_string&.gsub!(/\s+/, '')
  end

  # === Intance methods ===
  def swap_path_as_array
    swap_path_as_string.split(',')
  end
end
