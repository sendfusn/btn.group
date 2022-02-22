# frozen_string_literal: true

require 'rest-client'

class SecretNetworkCalculateAverageBlockTimeJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 5.minutes
    SecretNetworkCalculateAverageBlockTimeJob.set(wait_until: run_time).perform_later unless SecretNetworkCalculateAverageBlockTimeJob.scheduled?
  end

  def perform
    response = RestClient.get 'https://api.secretapi.io/blocks/latest'
    height = JSON.parse(response.body)['block']['header']['height']
    time = JSON.parse(response.body)['block']['header']['time']

    response_two = RestClient.get "https://api.secretapi.io/blocks/#{height.to_i - 1}"
    time_two = JSON.parse(response_two.body)['block']['header']['time']

    response_three = RestClient.get "https://api.secretapi.io/blocks/#{height.to_i - 2}"
    time_three = JSON.parse(response_three.body)['block']['header']['time']

    response_four = RestClient.get "https://api.secretapi.io/blocks/#{height.to_i - 3}"
    time_four = JSON.parse(response_four.body)['block']['header']['time']

    cumulative_block_time = 0
    block_times = [(DateTime.parse(time) - DateTime.parse(time_two)) * 24 * 60 * 60, (DateTime.parse(time_two) - DateTime.parse(time_three)) * 24 * 60 * 60, (DateTime.parse(time_three) - DateTime.parse(time_four)) * 24 * 60 * 60].each do |block_time|
      cumulative_block_time += block_time
    end

    Blockchain.secret_network.first.update(latest_block_time: cumulative_block_time / block_times.length)
  end
end
