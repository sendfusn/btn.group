# frozen_string_literal: true

FactoryBot.define do
  factory :pool_swap_path do
    association :pool
    association :swap_path
  end
end
