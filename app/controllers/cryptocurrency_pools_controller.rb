# frozen_string_literal: true

# Have a look at cryptocurrencies controller for examples of variables we can send in

class CryptocurrencyPoolsController < ApplicationController
  before_action :authenticate_admin_user!, only: :update
  before_action :set_cryptocurrency_pool, only: :update

  def update
    @cp.update!(cryptocurrency_pool_params)
  end

  private

    def cryptocurrency_pool_params
      params.require(:cryptocurrency_pool).permit(:amount)
    end

    def set_cryptocurrency_pool
      @cp = CryptocurrencyPool.find(params[:id])
    end
end
