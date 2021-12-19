# frozen_string_literal: true

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
      Cryptocurrency.where(coin_gecko_id: coin_gecko_id).each do |c|
        c.update!(price: price['usd'])
      end
    end
  end
end
