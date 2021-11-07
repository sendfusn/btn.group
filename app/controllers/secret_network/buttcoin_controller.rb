# frozen_string_literal: true

require 'rest-client'

module SecretNetwork
  class ButtcoinController < ApplicationController
    def index; end

    def circulating_supply
      response = RestClient.get 'https://api.secretapi.io/blocks/latest'
      height = JSON.parse(response.body)['block']['header']['height']
      render json: {
        circulating_supply: (28_000_006 - ((15_060_000 - height.to_i) * 1.4)).round(1).to_s,
        height: height
      }
    end
  end
end
