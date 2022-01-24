# frozen_string_literal: true

class SwapPathsController < ApplicationController
  before_action :authenticate_admin_user!, only: :index, if: :arbitrage?
  before_action :set_swap_paths

  def index
    unless params['arbitrage'] == 'true'
      top_swap_paths = []
      @swap_paths.find_each do |sp|
        result_amount = sp.simulate_swaps(params['from_amount'])
        net_usd_outcome = sp.net_result_as_usd(result_amount)
        top_swap_paths.push({ swap_path_id: sp.id, result_amount: result_amount, net_usd_outcome: net_usd_outcome })
      end
      top_swap_paths = top_swap_paths.sort_by { |obj| obj[:net_usd_outcome] }
                                     .reverse
                                     .map { |obj| obj[:swap_path_id] }[0..4]
      # If swap paths don't hold at least one sienna swap path with swap count one, add it.
      # We are only factoring in swap count one because sienna doesn't do routing.
      sienna_swap_path_id = SwapPath.find_by(from_id: params['from_id'], to_id: params['to_id'], protocol: Protocol.find_by(identifier: 'sienna'), swap_count: 1)&.id
      top_swap_paths.push(sienna_swap_path_id) if sienna_swap_path_id
      # If swap paths don't hold at least two secret swap paths, add the top two.
      top_secret_swap_paths = []
      @swap_paths.where(protocol: Protocol.find_by(identifier: 'secret_swap')).find_each do |sp|
        result_amount = sp.simulate_swaps(params['from_amount'])
        net_usd_outcome = sp.net_result_as_usd(result_amount)
        top_secret_swap_paths.push({ swap_path_id: sp.id, result_amount: result_amount, net_usd_outcome: net_usd_outcome })
      end
      top_secret_swap_paths = top_secret_swap_paths.sort_by { |obj| obj[:net_usd_outcome] }
                                                   .reverse
                                                   .map { |obj| obj[:swap_path_id] }[0..1]
      @swap_paths = SwapPath.where(id: top_swap_paths + top_secret_swap_paths)
    end
    render json: @swap_paths, methods: %i[arbitrage_amount_formatted gas gas_in_usd swap_path_as_array], include: { from: {}, to: {} }
  end

  private

    def arbitrage?
      return if params['from_id'].blank? || params['to_id'].blank?

      params['from_id'] == params['to_id']
    end

    def maximum_tradeable_amount
      c = Cryptocurrency.find(params['from_id'])
      return 0.0 if c.price.blank? || c.decimals.blank?

      c.price * params['from_amount'].to_d / (10**c.decimals)
    end

    def set_swap_paths
      if params['arbitrage'] == 'true' || arbitrage?
        @swap_paths = SwapPath.where('arbitrage_amount > ?', 0)
                              .order(arbitrage_profit: :desc)
        @swap_paths = @swap_paths.where(from_id: params['from_id'], to_id: params['to_id']) if arbitrage?
        @swap_paths = @swap_paths.limit(50)
      else
        @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id'])
                              .where('maximum_tradeable_value >= ?', maximum_tradeable_amount)
        @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id']) if @swap_paths.empty?
        @swap_paths = @swap_paths.where(protocol_id: params[:protocol_id]) if params[:protocol_id]
        @swap_paths = @swap_paths.order(maximum_tradeable_value: :desc)
                                 .order(:swap_count)
                                 .limit(50)
      end
    end
end
