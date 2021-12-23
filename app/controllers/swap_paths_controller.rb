# frozen_string_literal: true

class SwapPathsController < ApplicationController
  before_action :authenticate_admin_user!, only: :index, if: :arbitrage?

  def index
    @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id']).where('maximum_tradeable_value >= ?', maximum_tradeable_amount).order(maximum_tradeable_value: :desc).order(:swap_count).limit(50)
    top_five_swap_paths = []
    @swap_paths.each do |sp|
      top_five_swap_paths.push({ swap_path_id: sp.id, result_amount: sp.simulate_swaps(params['from_amount']) })
    end
    top_five_swap_paths = top_five_swap_paths.sort_by { |obj| obj[:result_amount].to_i }.reverse.map { |obj| obj[:swap_path_id] }[0..4]
    @swap_paths = SwapPath.where(id: top_five_swap_paths)
    render json: @swap_paths, methods: :swap_path_as_array, include: { from: {}, to: {} }
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
end
