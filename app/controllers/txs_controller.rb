# frozen_string_literal: true

class TxsController < ApplicationController
  before_action :authenticate_admin_user!, only: :create

  def create
    tx = Tx.new(tx_params)
    # from_address = params[:tx][:from_address]
    # to_address = params[:tx][:to_address]
    # Check if from_address belongs to a smart contract, if so
    # set from as that smart contract
    # If not, check if wallet has that address
    # if it does, set the wallet to from,
    # otherwise create a new wallet and set the from to that.
    # Do this for the to as well
    tx.save!
  end

  private

    def tx_params
      params.require(:tx).permit(:cryptocurrency_id, :identifier)
    end
end
