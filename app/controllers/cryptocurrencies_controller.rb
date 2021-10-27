# frozen_string_literal: true

class CryptocurrenciesController < ApplicationController
  def index
    render json: Cryptocurrency.joins(:smart_contract).where(smart_contract: { blockchain_id: params['blockchain_id'] }).where('length(name) < 20')
  end
end
