# frozen_string_literal: true

module SecretNetwork
  class PagesController < ApplicationController
    before_action :authenticate_admin_user!, only: %i[trade_pairs]

    def address_alias
      @head_description = 'Create an alias for your Secret Network wallet address.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/address_alias/wallet_jkkqa4.png'
      @head_title = 'Address alias | Secret network | btn.group'
    end

    def block_locker
      @head_description = 'Never lose your blockchain keys. Decentralized, immutable and affordable way to store your blockchain keys on the Secret network.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/block_locker/bl2_ep4ctq.png'
      @head_title = 'Block locker | Secret network | btn.group'
    end

    def button_swap
      cryptocurrency_ids = Pool.trade_pair
                               .enabled
                               .joins(:smart_contract)
                               .where(smart_contract: { blockchain_id: Blockchain.find_by(identifier: :secret_network) })
                               .joins(:cryptocurrency_pools)
                               .where(cryptocurrency_pools: { cryptocurrency_role: :deposit })
                               .pluck(:cryptocurrency_id)
                               .uniq
      @cryptocurrencies = Cryptocurrency.where(id: cryptocurrency_ids).where.not(coin_gecko_id: nil).where.not(symbol: %w[ATOM DVPN LUNA OSMO UST]).order(:symbol)
      @cryptocurrencies = @cryptocurrencies.where.not(symbol: 'ALTER') unless authenticate_admin_user!
      @head_description = 'DeFi / DEX aggregator offering the best token swap rates on the Secret network.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/dex_aggregator/dex_mhead_rs_xxqpdz.png'
      @head_title = 'Button Swap | Secret network | btn.group'
    end

    def butt_lode; end

    def mount_doom
      @navbar_container_fluid = true
      @head_description = 'Burn contract for Secret network tokens.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/mount_doom/mt_doom_biwkdj.png'
      @head_title = 'Mount Doom | Secret network | btn.group'
    end

    def password_manager
      @head_description = 'Decentralized password manager on the Secret network.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/password_manager/wheel_of_password_obhsyv.jpg'
      @head_title = 'Password manager | Secret network | btn.group'
    end

    def pools
      @navbar_container_fluid = true
      @head_description = 'Farm, yield optimizer and profit sharing pools by btn.group on the Secret Network.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/yield_optimizer/3143e566-c3f1-4252-80f2-6bbbc5242368_pfkrls.png'
      @head_title = 'Pools | Secret network | btn.group'
    end

    def smart_contract_interface
      @head_description = 'Web interface for Secret network smart contracts.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/smart_contract_interface/contract_rough_MG_tw1vei.png'
      @head_title = 'Smart contract interface | Secret network | btn.group'
    end

    def trade_pairs
      @navbar_container_fluid = true
      @head_title = 'Trade pairs | Secret network | btn.group'
    end

    def transactions
      @navbar_container_fluid = true
      @head_description = 'Transactions viewer for Secret network tokens.'
      @head_image = 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_160/secret_network/transactions/transaction_rough_j8coyp.png'
      @head_title = 'Transactions | Secret network | btn.group'
    end

    def why_some_of_our_contracts_are_not_private
      @show_footer = true
    end

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
