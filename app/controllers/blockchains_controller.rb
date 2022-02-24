# frozen_string_literal: true

class BlockchainsController < ApplicationController
  helper_method :blockchain

  def show
    render json: blockchain
  end

  def stats
    render :stats
  end

  private

    def blockchain
      @blockchain ||= Blockchain.find(params[:id])
    end
end
