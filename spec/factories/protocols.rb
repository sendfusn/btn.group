# frozen_string_literal: true

FactoryBot.define do
  factory :protocol do
    identifier { (Protocol.identifiers.keys - Protocol.pluck(:identifier)).sample }
    sequence(:name) { |n| "name#{n}" }
    sequence(:url) { |n| "https://url#{n}.com" }
  end
end
