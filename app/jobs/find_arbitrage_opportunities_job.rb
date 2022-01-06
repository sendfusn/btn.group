# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    swap_paths = SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
                         .where('maximum_tradeable_value > ?', 50)
    return if swap_paths.where('updated_at > ?', Time.current - 1.minute).present?

    swap_paths.each do |sp|
      next if Sidekiq::ScheduledSet.new.any? do |job|
                job.item['wrapped'] == 'SetBestArbitrageOpportunityForSwapPathJob' && job.args[0]['arguments'].first == sp.id
              end

      SetBestArbitrageOpportunityForSwapPathJob.set(wait_until: Time.current + 5.seconds).perform_later(sp.id)
    end
  end
end
