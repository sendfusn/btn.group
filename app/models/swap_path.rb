# frozen_string_literal: true

class SwapPath < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :from, class_name: 'Cryptocurrency'
  belongs_to :to, class_name: 'Cryptocurrency'
  belongs_to :protocol, optional: true
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
    swap_path.set_maximum_tradeable_value
  end

  before_create do |swap_path|
    # remove spaces from swap path as string
    swap_path.swap_path_as_string&.gsub!(/\s+/, '')
    # set protocol_id for swap path if all pools involved are from the same protocol
    protocol_ids = Pool.where(id: swap_path.swap_path_as_array).pluck(:protocol_id).uniq
    swap_path.protocol_id = protocol_ids.first if protocol_ids.count == 1
  end

  # === INSTANCE METHODS ===
  def gas
    g = 100_000
    pools.order(:position).each_with_index do |pool, index|
      protocol_identifier = pool.protocol.identifier
      g += 150_000 if protocol_identifier == 'sienna'
      g += 150_000 if protocol_identifier == 'secret_swap'
      g -= 30_000 if index >= 1
    end
    g
  end

  def gas_in_usd
    Cryptocurrency.find_by(symbol: 'SCRT', official: true).price * gas / 4_000_000
  end

  def net_result_as_usd(result_amount)
    to.amount_as_usd(result_amount) - gas_in_usd
  end

  def set_maximum_tradeable_value
    mtv = pools&.order(:total_locked)&.first&.total_locked

    update(maximum_tradeable_value: mtv) if mtv != maximum_tradeable_value
  end

  def simulate_swaps(amount)
    current_from_id = from_id
    pools.order(:position).each do |pool|
      amount = pool.simulate_swap(amount, current_from_id)[:return_amount]
      current_from_id = pool.cryptocurrency_pools.deposit.where.not(cryptocurrency_id: current_from_id).first.cryptocurrency_id
    end
    amount
  end

  def swap_path_as_array
    swap_path_as_string.split(',')
  end
end
