# frozen_string_literal: true

FactoryBot.define do
  factory :wallet do
    sequence(:address) { |n| "address#{n}" }

    association :blockchain
  end
end
