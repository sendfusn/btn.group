# frozen_string_literal: true

require 'rest-client'

class CryptoPricesJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 1.minute
    CryptoPricesJob.set(wait_until: run_time).perform_later unless CryptoPricesJob.scheduled?
  end

  def perform
    query_coin_gecko_ids_string = ''
    Cryptocurrency.where.not(coin_gecko_id: nil).pluck(:coin_gecko_id).uniq.each_with_index do |coin_gecko_id, index|
      query_coin_gecko_ids_string += ',' if index >= 1
      query_coin_gecko_ids_string += coin_gecko_id
    end
    return if query_coin_gecko_ids_string.empty?

    response = RestClient.get "https://api.coingecko.com/api/v3/simple/price?ids=#{query_coin_gecko_ids_string}&vs_currencies=usd"
    response_as_json = JSON.parse(response.body)
    response_as_json.each do |coin_gecko_id, price|
      Cryptocurrency.where(coin_gecko_id: coin_gecko_id).find_each do |c|
        c.update!(price: price['usd']) if price['usd'].present?
      end
    end
    shd = Cryptocurrency.find_by(symbol: 'SHD', official: true)
    sscrt = Cryptocurrency.find_by(symbol: 'SSCRT', official: true)
    sscrt_per_shd = sscrt.amount_with_decimals(Pool.find(865).simulate_swap(100_000_000, shd.id)[:return_amount])
    shd.update(price: sscrt_per_shd * sscrt.price) if shd.price.nil?
  end
end
