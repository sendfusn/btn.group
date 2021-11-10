# frozen_string_literal: true

FactoryBot.define do
  factory :blockchain do
    identifier { rand(1) }
    sequence(:name) { |n| "cryptocurrency#{n}" }
  end
end
