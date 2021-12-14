# frozen_string_literal: true

# Have a look at cryptocurrencies controller for examples of variables we can send in

class PoolsController < ApplicationController
  before_action :authenticate_admin_user!, only: :update
  before_action :set_pool, only: :update

  def index
    @pools = Pool.where(category: :trade_pair)
    @pools = @pools.where(enabled: true) if params['enabled'] == 'true'
    @pools = @pools.includes(:smart_contract)
                   .where(smart_contract: { blockchain_id: Blockchain.find_by(identifier: :secret_network) })
    render json: @pools, include: { protocol: {}, smart_contract: {}, cryptocurrency_pools: { include: { cryptocurrency: { include: { smart_contract: {} } } } } }
  end

  def update
    @pool.update!(pool_params)
  end

  private

    def pool_params
      params.require(:pool).permit(:enabled, :total_locked)
    end

    def set_pool
      @pool = Pool.find(params[:id])
    end
end
