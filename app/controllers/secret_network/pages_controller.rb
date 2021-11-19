# frozen_string_literal: true

module SecretNetwork
  class PagesController < ApplicationController
    def address_alias; end

    def dex_aggregator; end

    def butt_lode; end

    def mount_doom; end

    def pools; end

    def transactions
      @head_description = 'Transactions viewer for Secret network tokens.'
      @head_title = 'Transactions | Secret network | btn.group'
    end

    def why_some_of_our_contracts_are_not_private; end

    def head_description
      @head_description || 'Buttcoin, block locker, yield optimizer and other blockchain solutions on the Secret and NEAR networks.'
    end

    def head_title
      @head_title || 'btn.group'
    end
  end
end
