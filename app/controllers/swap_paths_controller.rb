# frozen_string_literal: true

class SwapPathsController < ApplicationController
  before_action :authenticate_admin_user!, only: :index, if: :arbitrage?

  def index
    @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id']).where('maximum_tradeable_value >= ?', maximum_tradeable_amount).order(:swap_count).limit(55)
    render json: @swap_paths, methods: :swap_path_as_array, include: { from: {}, to: {} }
  end

  private

    def arbitrage?
      params['from_id'] == params['to_id']
    end

    def maximum_tradeable_amount
      c = Cryptocurrency.find(params['from_id'])
      c.price * params['from_amount'].to_d / (10**c.decimals)
    end
end
