# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def home; end

  def features
    {
      secret_network: {
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
          }
        }
      }
    }
  end
end
