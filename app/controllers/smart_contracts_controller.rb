# frozen_string_literal: true

class SmartContractsController < ApplicationController
  def index
    render json: SmartContract.where(blockchain_id: params[:blockchain_id])
  end
end
