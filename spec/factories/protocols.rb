# frozen_string_literal: true

FactoryBot.define do
  factory :protocol do
    identifier { rand(2) }
    sequence(:name) { |n| "name#{n}" }
    sequence(:url) { |n| "https://url#{n}.com" }
  end
end
