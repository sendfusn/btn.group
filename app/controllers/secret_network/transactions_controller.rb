# frozen_string_literal: true

class SecretNetwork::TransactionsController < ApplicationController
  helper_method :tokens

  def index; end

  def tokens
    {
      production: [
        {
          name: 'sSCRT',
          address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek'
        },
        {
          name: 'SEFI',
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt'
        }
      ],
      staging: []
    }
  end
end
