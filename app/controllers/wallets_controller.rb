# frozen_string_literal: true

class WalletsController < ApplicationController
  before_action :authenticate_admin_user!, only: :update
  before_action :set_wallet, only: :update

  def update
    @wallet.update!(wallet_params)
  end

  private

    def wallet_params
      params.require(:wallet).permit(:address, :butt_staked, :blockchain_id)
    end

    def set_wallet
      @wallet = Wallet.find(params[:id])
    end
end
