# frozen_string_literal: true

FactoryBot.define do
  factory :smart_contract do
    sequence(:address) { |n| "address#{n}" }
    sequence(:data_hash) { |n| "data_hash#{n}" }
    sequence(:label) { |n| "smart_contract_label#{n}" }

    association :blockchain
  end
end
