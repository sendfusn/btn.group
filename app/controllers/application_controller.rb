# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def about; end

  def home; end

  def features
    {
      block_locker: {
        blockchain: 'Secret network',
        name: 'Block locker',
        status: 'Work in progress'
      },
      buttcoin: {
        blockchain: 'Secret network',
        name: 'Buttcoin (BUTT)',
        status: 'Work in progress'
      },
      secret_network_alias: {
        blockchain: 'Secret network',
        name: 'Secret network alias',
        status: 'Live'
      }
    }
  end
end
