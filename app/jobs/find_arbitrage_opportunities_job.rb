# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    return if SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
                      .where('maximum_tradeable_value > ?', 50)
                      .where('updated_at > ?', Time.current - 1.minute)
                      .present?

    SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
            .where('maximum_tradeable_value > ?', 50)
            .where('updated_at < ?', Time.current - 5.minutes)
            .each do |sp|
              SetBestArbitrageOpportunityForSwapPathJob.perform_later(sp.id) unless Sidekiq::ScheduledSet.new.any? do |job|
                                                                                      job.item['wrapped'] == 'SetBestArbitrageOpportunityForSwapPathJob' && job.args[0]['arguments'].first == sp.id
                                                                                    end
            end
  end
end
