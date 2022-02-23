# frozen_string_literal: true

module Near
  class PagesController < ApplicationController
    def smart_contract_interface
      @head_description = 'Web interface for NEAR smart contracts.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/smart_contract_interface/contract_rough_MG_tw1vei.png'
      @head_title = 'Smart contract interface | NEAR | btn.group'
    end

    def blockchain
      @blockchain ||= Blockchain.near.first
    end
  end
end
