# frozen_string_literal: true

require 'rest-client'

module SecretNetwork
  class ButtcoinController < ApplicationController
    def index
      @show_footer = true
      @head_description = 'The native token of btn.group.'
      @head_title = 'Buttcoin (BUTT) | Secret network | btn.group'
    end

    def circulating_supply
      response = RestClient.get 'https://api.secretapi.io/blocks/latest'
      height = JSON.parse(response.body)['block']['header']['height']
      circulating_supply = 28_000_006
      circulating_supply -= (15_060_000 - height.to_i) * 1.4 if height.to_i < 15_060_000
      render json: {
        circulating_supply: circulating_supply.round(1).to_s,
        height: height
      }
    end
  end
end
