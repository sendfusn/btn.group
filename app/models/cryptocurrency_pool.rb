# frozen_string_literal: true

class CryptocurrencyPool < ApplicationRecord
  self.table_name = 'cryptocurrencies_pools'

  # === ASSOCIATIONS ===
  belongs_to :cryptocurrency
  belongs_to :pool

  # === ENUMS ===
  enum cryptocurrency_role: { deposit: 0, reward: 1, shares: 2 }

  # === VALIDATIONS ===
  validates :cryptocurrency_role, presence: true
  validates :cryptocurrency_role, uniqueness: { scope: %i[cryptocurrency_id pool_id] }

  # === CALLBACKS ===

  # when the amount is changed, we need to update the total locked in the pool
  after_save do |cp|
    if cp.deposit? && cp.amount.present? && cp.saved_change_to_amount?
      cp.pool.update_total_locked
      cp.pool.update!(enabled: false) if cp.pool.trade_pair? && cp.amount.to_i.zero?
      difference = cp.saved_change_to_amount.first.to_i - cp.saved_change_to_amount.second.to_i
      difference *= -1 unless difference.positive?
      if cp.cryptocurrency.price.present? && !(Sidekiq::ScheduledSet.new.any? do |job|
                                                 job.item['wrapped'] == 'FindArbitrageOpportunitiesJob' && job.args[0]['arguments'].first == cp.cryptocurrency_id
                                               end) && (cp.cryptocurrency.amount_as_usd(difference) > 100)
        FindArbitrageOpportunitiesJob.set(wait_until: Time.current + 5.minutes).perform_later(cp.cryptocurrency_id)
      end
    end
  end
end
