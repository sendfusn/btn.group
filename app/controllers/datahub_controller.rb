# frozen_string_literal: true

# Move this to secret_network namespace when you get the time. No hurry.

class DatahubController < ApplicationController
  include ReverseProxy::Controller

  skip_before_action :verify_authenticity_token

  def index
    datahub_url = "https://secret-4--lcd--archive.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}"
    path = request.fullpath.split('datahub').second
    reverse_proxy datahub_url, path: path, headers: { 'HOST' => nil } do |config|
      # We got a 404!
      config.on_missing do |_code, _response|
        return redirect_to root_url
      end

      config.on_success do |_code, response|
        return render json: JSON.parse(response.body)
      end

      # There's also other callbacks:
      # - on_set_cookies
      # - on_connect
      # - on_response
      # - on_set_cookies
      # - on_success
      # - on_redirect
      # - on_missing
      # - on_error
      # - on_complete
    end
  end

  def rpc
    datahub_url = "https://secret-4--rpc--full.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}"
    # Keep ending slash here so that it's the same as cloudflare settings
    path = request.fullpath.split('datahub_rpc/').second || ''
    reverse_proxy datahub_url, path: path, headers: { 'HOST' => nil } do |config|
      # We got a 404!
      config.on_missing do |_code, _response|
        return redirect_to root_url
      end

      config.on_success do |_code, response|
        return render json: JSON.parse(response.body)
      end

      # There's also other callbacks:
      # - on_set_cookies
      # - on_connect
      # - on_response
      # - on_set_cookies
      # - on_success
      # - on_redirect
      # - on_missing
      # - on_error
      # - on_complete
    end
  end

  def index_staging
    datahub_url = "https://secret-pulsar-2--lcd--full.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}"
    path = request.fullpath.split('datahub_staging').second
    reverse_proxy datahub_url, path: path, headers: { 'HOST' => nil } do |config|
      # We got a 404!
      config.on_missing do |_code, _response|
        return redirect_to root_url
      end

      config.on_success do |_code, response|
        return render json: JSON.parse(response.body)
      end
    end
  end
end
