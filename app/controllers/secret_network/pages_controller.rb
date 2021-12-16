# frozen_string_literal: true

module SecretNetwork
  class PagesController < ApplicationController
    before_action :authenticate_admin_user!, only: :trade_pairs

    def address_alias; end

    def block_locker
      @head_description = 'Never lose your blockchain keys. Decentralized, immutable and affordable way to store your blockchain keys on the Secret network.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/block_locker/bl2_ep4ctq.png'
      @head_title = 'Block locker | Secret network | btn.group'
    end

    def dex_aggregator
      pools = Pool.where(category: :trade_pair, enabled: true)
                  .joins(:smart_contract)
                  .where(smart_contract: { blockchain_id: Blockchain.find_by(identifier: :secret_network) })
      cryptocurrency_ids = []
      pools.each do |pool|
        pool.cryptocurrency_pools.where(cryptocurrency_role: :deposit).each do |cp|
          cryptocurrency_ids.push(cp.cryptocurrency_id)
        end
      end
      @cryptocurrencies = Cryptocurrency.where(id: cryptocurrency_ids.uniq).order(:symbol)
      @default_from_token_id = Cryptocurrency.find_by(symbol: 'SCRT').id
      @default_to_token_id = Cryptocurrency.find_by(symbol: 'BUTT').id
      @head_description = 'DEX aggregator for Secret network.'
      @head_title = 'DEX aggregator | Secret network | btn.group'
    end

    def butt_lode; end

    def mount_doom
      @head_description = 'Burn contract for Secret network tokens.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/mount_doom/mt_doom_biwkdj.png'
      @head_title = 'Mount Doom | Secret network | btn.group'
    end

    def password_manager
      @head_description = 'Decentralized password manager on the Secret network.'
      @head_title = 'Password manager | Secret network | btn.group'
    end

    def pools; end

    def smart_contract_interface
      @head_description = 'Web interface for Secret network smart contracts.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/smart_contract_interface/contract_rough_MG_tw1vei.png'
      @head_title = 'Smart contract interface | Secret network | btn.group'
    end

    def trade_pairs; end

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
