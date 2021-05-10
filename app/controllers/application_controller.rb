# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features

  def about; end

  def buttcoin; end

  def home; end

  def features
    {
      block_locker: {
        blockchain: 'Secret network',
        name: 'Block locker'
      },
      secret_network_alias: {
        blockchain: 'Secret network',
        name: 'Secret network alias'
      }
    }
  end
end
