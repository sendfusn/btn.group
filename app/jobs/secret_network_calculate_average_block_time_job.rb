# frozen_string_literal: true

require 'rest-client'

class SecretNetworkCalculateAverageBlockTimeJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 1.minute
    SecretNetworkCalculateAverageBlockTimeJob.set(wait_until: run_time).perform_later unless SecretNetworkCalculateAverageBlockTimeJob.scheduled?
  end

  def perform
    response = RestClient.get "https://secret-4--lcd--archive.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}/blocks/latest"
    height = JSON.parse(response.body)['block']['header']['height']
    time = JSON.parse(response.body)['block']['header']['time']

    response_two = RestClient.get "https://secret-4--lcd--archive.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}/blocks/#{height.to_i - 5}"
    time_two = JSON.parse(response_two.body)['block']['header']['time']

    average_block_time_of_last_five_blocks = (DateTime.parse(time) - DateTime.parse(time_two)) * 24 * 60 * 60 / 5
    Blockchain.secret_network.first.update(latest_block_time: average_block_time_of_last_five_blocks)
  end
end
