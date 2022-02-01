# frozen_string_literal: true

class SmartContractsController < ApplicationController
  def index
    smart_contracts = if params['addresses']
      SmartContract.where(address: params['addresses'].split(','))
    else
      SmartContract.where(blockchain_id: params[:blockchain_id])
    end
    render json: smart_contracts
  end
end
