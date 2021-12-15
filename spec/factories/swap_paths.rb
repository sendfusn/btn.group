# frozen_string_literal: true

FactoryBot.define do
  factory :swap_path do
    sequence(:swap_path_as_string) { |n| "#{n}, #{n + 1}" }
    association :from, factory: :cryptocurrency
    association :to, factory: :cryptocurrency
  end
end
