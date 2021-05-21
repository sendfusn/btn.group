# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features, :logo_cloudinary_public_id

  def home; end

  def features
    {
      # binance: {
      #   cloudinary_public_id: 'logos/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e_vhapj8',
      #   name: 'Binance exchange',
      #   features: {
      #     auto_trader: {
      #       name: 'Auto trader',
      #       show_link: false,
      #       status: 'Work in progress'
      #     }
      #   }
      # },
      secret_network: {
        cloudinary_public_id: 'logos/external-content.duckduckgo_s4rezw',
        name: 'Secret network',
        features: {
          address_alias: {
            name: 'Address alias',
            show_link: true,
            status: 'Work in progress',
            contracts: {
              staging: 'secret1ghzaz67v647drlghd6m8njgl5lhavcwkal97ju',
              production: 'secret17fkl85nexfne274s578rsuatm62j96lvgmfs7u'
            }
          },
          # block_locker: {
          #   name: 'Block locker',
          #   status: 'Work in progress'
          # },
          # buttcoin: {
          #   name: 'Buttcoin (BUTT)',
          #   show_link: true,
          #   status: 'Work in progress'
          # },
          smart_contract_interface: {
            name: 'Smart contract interface',
            show_link: true,
            status: 'Live'
          },
          transactions: {
            name: 'Transactions',
            show_link: true,
            status: 'Live'
          }
        }
      }
    }
  end

  def logo_cloudinary_public_id
    'logos/button.group_logo_ecemui'
  end
end
