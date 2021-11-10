# frozen_string_literal: true

FactoryBot.define do
  factory :pool do
    association :protocol
    association :smart_contract
  end
end
