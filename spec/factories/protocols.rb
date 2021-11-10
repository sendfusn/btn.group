# frozen_string_literal: true

FactoryBot.define do
  factory :protocol do
    sequence(:name) { |n| "name#{n}" }
    sequence(:url) { |n| "https://url#{n}.com" }
    sequence(:identifier) { rand(2) }
  end
end
