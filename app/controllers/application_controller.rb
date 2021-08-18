# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features, :logo_cloudinary_public_id

  def home; end

  def roadmap; end

  def features
    {
      near: {
        cloudinary_public_id: 'logos/icon_nm_yirtpt',
        name: 'Near',
        features: {
          smart_contract_interface: {
            name: 'Smart contract interface',
            show_link: false,
            status: 'Work in progress'
          }
        }
      },
      secret_network: {
        cloudinary_public_id: 'logos/external-content.duckduckgo_s4rezw',
        name: 'Secret network',
        features: {
          address_alias: {
            name: 'Address alias',
            show_link: true,
            status: 'Live',
            contracts: {
              staging: 'secret1jyh69wsrq6ml8e7lp7jymupjqa2u736l3pnns0',
              production: 'secret1v2kg4uf4ffjyez3g50h3d0hze6858qgszlluzz'
            }
          },
          # block_locker: {
          #   name: 'Block locker',
          #   status: 'Work in progress'
          # },
          buttcoin: {
            name: 'Buttcoin (BUTT)',
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt'
            }
          },
          profit_distributor: {
            name: 'Profit distributor (WIP)',
            show_link: false,
            status: 'Work in progress'
          },
          smart_contract_interface: {
            name: 'Smart contract interface',
            show_link: true,
            status: 'Live'
          },
          transactions: {
            name: 'Transactions',
            show_link: true,
            status: 'Live'
          },
          yield_optimizer: {
            name: 'Yield optimizer (WIP)',
            show_link: false,
            status: 'Work in progress'
          }
        }
      }
    }
  end

  def logo_cloudinary_public_id
    'logos/button.group_logo_ecemui'
  end
end
