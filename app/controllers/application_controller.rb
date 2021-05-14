# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def home; end

  def features
    {
      secret_network_aliases: {
        blockchain: 'Secret network',
        name: 'Address alias',
        status: 'Work in progress'
      },
      block_locker: {
        blockchain: 'Secret network',
        name: 'Block locker',
        status: 'Work in progress'
      },
      # buttcoin: {
      #   blockchain: 'Secret network',
      #   name: 'Buttcoin (BUTT)',
      #   status: 'Work in progress'
      # },
      smart_contract_querier_secret_network: {
        blockchain: 'Secret network',
        name: 'Smart contract querier',
        status: 'Live'
      }
    }
  end
end
