# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def about; end

  def home; end

  def features
    {
      block_locker: {
        blockchain: 'Secret network',
        name: 'Block locker'
      },
      buttcoin: {
        blockchain: 'Secret network',
        name: 'Buttcoin (BUTT)'
      },
      secret_network_alias: {
        blockchain: 'Secret network',
        name: 'Secret network alias'
      }
    }
  end
end
