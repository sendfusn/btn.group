# frozen_string_literal: true

# Have a look at cryptocurrencies controller for examples of variables we can send in

class PoolsController < ApplicationController
  def index
    @pools = Pool.where(category: :trade_pair, enabled: true)
                 .includes(:smart_contract)
                 .where(smart_contract: { blockchain_id: Blockchain.find_by(identifier: :secret_network) })
    render json: @pools, include: { protocol: {}, smart_contract: {}, cryptocurrency_pools: { include: { cryptocurrency: {} } } }
  end
end
