# frozen_string_literal: true

module SecretNetwork
  class PagesController < ApplicationController
    def address_alias; end

    def dex_aggregator; end

    def butt_lode; end

    def mount_doom
      @head_description = 'Burn contract for Secret network tokens.'
      @head_title = 'Mount Doom | Secret network | btn.group'
    end

    def pools; end

    def smart_contract_interface
      @head_description = 'Web interface for Secret network smart contracts.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/smart_contract_interface/contract_rough_MG_tw1vei.png'
      @head_title = 'Smart contract interface | Secret network | btn.group'
    end

    def transactions
      @head_description = 'Transactions viewer for Secret network tokens.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/transactions/transaction_rough_j8coyp.png'
      @head_title = 'Transactions | Secret network | btn.group'
    end

    def why_some_of_our_contracts_are_not_private; end

    def head_description
      @head_description || 'Buttcoin, block locker, yield optimizer and other blockchain solutions on the Secret and NEAR networks.'
    end

    def head_image
      @head_image || 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_80/v1621228725/logos/btn_purple_background_uu2ere.png'
    end

    def head_title
      @head_title || 'btn.group'
    end
  end
end
