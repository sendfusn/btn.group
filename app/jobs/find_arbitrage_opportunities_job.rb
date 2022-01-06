# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
            .where('maximum_tradeable_value > ?', 50)
            .where('updated_at < ?', Time.current - 15.minutes)
            .each do |sp|
              SetBestArbitrageOpportunityForSwapPathJob.set(wait_until: Time.current + 5.minutes).perform_later(sp.id) unless Sidekiq::ScheduledSet.new.any? do |job|
                                                                                                                                job.item['wrapped'] == 'SetBestArbitrageOpportunityForSwapPathJob' && job.args[0]['arguments'].first == sp.id
                                                                                                                              end
            end
  end
end
