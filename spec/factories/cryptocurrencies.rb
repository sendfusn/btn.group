# frozen_string_literal: true

FactoryBot.define do
  factory :cryptocurrency do
    decimals { rand(1..36) }
    sequence(:name) { |n| "name#{n}" }
    sequence(:symbol) { |n| "symbol#{n}" }

    association :blockchain
    association :smart_contract
  end
end
