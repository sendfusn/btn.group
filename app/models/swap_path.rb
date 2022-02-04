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

  before_save do |swap_path|
    swap_path.swap_path_as_string&.gsub!(/\s+/, '')
    protocol_ids = Pool.where(id: swap_path.swap_path_as_array).pluck(:protocol_id).uniq
    swap_path.protocol_id = protocol_ids.first if protocol_ids.count == 1
  end

  # === Instance methods ===
  def net_result_as_usd(result_amount)
    Cryptocurrency.find(to_id).amount_as_usd(result_amount) - gas_in_usd
  end

  def simulate_swaps(amount)
    current_from_id = from_id
    swap_path_as_array.each do |pool_id|
      pool = Pool.find(pool_id)
      amount = pool.simulate_swap(amount, current_from_id)[:return_amount]
      current_from_id = pool.cryptocurrency_pools.deposit.where.not(cryptocurrency_id: current_from_id).first.cryptocurrency_id
    end
    amount
  end

  def crypto_id_path
    current_from_id = from_id
    cip = [from_id]
    swap_path_as_array.each do |pool_id|
      pool = Pool.find(pool_id)
      current_from_id = pool.cryptocurrency_pools.deposit.where.not(cryptocurrency_id: current_from_id).first.cryptocurrency_id
      cip.push(current_from_id)
    end
    cip
  end

  def gas
    g = 100_000
    swap_path_as_array.each_with_index do |pool_id, index|
      protocol_identifier = Pool.find(pool_id).protocol.identifier
      g += 185_000 if protocol_identifier == 'sienna'
      g += 185_000 if protocol_identifier == 'secret_swap'
      g -= 30_000 if index >= 1
    end
    g
  end

  def gas_in_usd
    Cryptocurrency.find_by(symbol: 'SCRT', official: true).price * gas / 4_000_000
  end

  def set_maximum_tradeable_value
    return unless (mtv = pools&.order(:total_locked)&.first&.total_locked)

    update(maximum_tradeable_value: mtv) if mtv != maximum_tradeable_value
  end

  def swap_path_as_array
    swap_path_as_string.split(',')
  end
end
