# frozen_string_literal: true

# Have a look at cryptocurrencies controller for examples of variables we can send in

class PoolsController < ApplicationController
  def index
    @pools = Pool.includes(:smart_contract)
                 .where(smart_contract: { blockchain_id: Blockchain.find_by(identifier: :secret_network) })
    @pools = @pools.where(enabled: true) if params['enabled'] == 'true'
    @pools = @pools.where(category: params['categories'].split(',')) if params['categories'].split(',').present?
    render json: @pools, include: { protocol: {}, smart_contract: {}, cryptocurrency_pools: { include: { cryptocurrency: { include: { smart_contract: {}, attachments: {} } } } } }
  end

  def tvl
    render json: Protocol.btn_group.first.pools.sum(:total_locked).to_s
  end
end
