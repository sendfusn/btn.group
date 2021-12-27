# frozen_string_literal: true

class SwapPathsController < ApplicationController
  before_action :authenticate_admin_user!, only: :index, if: :arbitrage?
  before_action :set_swap_paths

  def index
    top_five_swap_paths = []
    @swap_paths.each do |sp|
      result_amount = sp.simulate_swaps(params['from_amount'])
      net_usd_outcome = sp.net_result_as_usd(result_amount)
      top_five_swap_paths.push({ swap_path_id: sp.id, result_amount: result_amount, net_usd_outcome: net_usd_outcome })
    end
    top_five_swap_paths = top_five_swap_paths.sort_by { |obj| obj[:net_usd_outcome] }
                                             .reverse
                                             .map { |obj| obj[:swap_path_id] }[0..4]
    @swap_paths = SwapPath.where(id: top_five_swap_paths)
    render json: @swap_paths, methods: %i[gas_in_usd swap_path_as_array], include: { from: {}, to: {} }
  end

  def simulate_swaps
    simulation_results = []
    @swap_paths.each do |sp|
      result_amount = sp.simulate_swaps(params['from_amount'])
      net_usd_outcome = sp.net_result_as_usd(result_amount)
      simulation_results.push({ swap_path_id: sp.id, result_amount: result_amount, net_usd_outcome: net_usd_outcome })
    end
    simulation_results = simulation_results.sort_by { |obj| obj[:net_usd_outcome] }
                                           .reverse
    render json: simulation_results
  end

  private

    def arbitrage?
      params['from_id'] == params['to_id']
    end

    def maximum_tradeable_amount
      c = Cryptocurrency.find(params['from_id'])
      return 0.0 if c.price.blank? || c.decimals.blank?

      c.price * params['from_amount'].to_d / (10**c.decimals)
    end

    def set_swap_paths
      @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id'])
                            .where('maximum_tradeable_value >= ?', maximum_tradeable_amount)
                            .order(maximum_tradeable_value: :desc)
                            .order(:swap_count)
      @swap_paths = @swap_paths.where(protocol_id: params[:protocol_id]) if params[:protocol_id]
      @swap_paths = @swap_paths.limit(50)
      return if @swap_paths.count > 5

      @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id'])
                            .order(maximum_tradeable_value: :desc)
                            .order(:swap_count)
      @swap_paths = @swap_paths.where(protocol_id: params[:protocol_id]) if params[:protocol_id]
      @swap_paths = @swap_paths.limit(50)
    end
end
