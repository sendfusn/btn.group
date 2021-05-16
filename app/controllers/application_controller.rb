# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def home; end

  def features
    {
      secret_network: {
        cloudinary_public_id: 'logos/external-content.duckduckgo_s4rezw',
        name: 'Secret network',
        features: {
          address_alias: {
            name: 'Address alias',
            status: 'Work in progress'
          },
          # block_locker: {
          #   name: 'Block locker',
          #   status: 'Work in progress'
          # },
          # buttcoin: {
          #   name: 'Buttcoin (BUTT)',
          #   status: 'Work in progress'
          # },
          smart_contract_querier: {
            name: 'Smart contract querier',
            status: 'Live'
          },
          transactions: {
            name: 'Transactions',
            status: 'Work in progress'
          }
        }
      }
    }
  end
end
