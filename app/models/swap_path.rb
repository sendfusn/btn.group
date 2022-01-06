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

  def set_optimal_arbitrage_details
    return if from_id != to_id

    arbitrage_amount = 0
    arbitrage_profit = -555
    largest_range_of_pools = 0
    swap_path_as_array.each do |pool_id|
      asset_1_value = 0
      asset_2_value = 0
      Pool.find(pool_id).cryptocurrency_pools.deposit.each_with_index do |cp, index|
        asset_1_value = cp.cryptocurrency.amount_as_usd(cp.amount) if index.zero?
        asset_2_value = cp.cryptocurrency.amount_as_usd(cp.amount) if index.positive?
      end
      price_difference = if asset_1_value > asset_2_value
        asset_1_value - asset_2_value
      else
        asset_2_value - asset_1_value
      end
      largest_range_of_pools = price_difference if price_difference > largest_range_of_pools
    end
    interval_amount = largest_range_of_pools / 20 / from.price * 10**from.decimals
    current_amount = interval_amount
    current_amount_as_usd = from.amount_as_usd(current_amount)
    while maximum_tradeable_value > current_amount_as_usd && largest_range_of_pools > current_amount_as_usd
      net_profit = net_result_as_usd(simulate_swaps(current_amount)) - current_amount_as_usd
      if net_profit > arbitrage_profit
        arbitrage_amount = current_amount
        arbitrage_profit = net_profit
      end
      current_amount += interval_amount
      current_amount_as_usd = from.amount_as_usd(current_amount)
    end
    update!(arbitrage_amount: arbitrage_amount, arbitrage_profit: arbitrage_profit)
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
    g = 0
    # g += 100_000 if swap_count >= 2
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

  def swap_path_as_array
    swap_path_as_string.split(',')
  end
end
