# frozen_string_literal: true

FactoryBot.define do
  factory :blockchain do
    identifier { Blockchain.identifiers.values.sample }
    sequence(:name) { |n| "cryptocurrency#{n}" }
  end
end
