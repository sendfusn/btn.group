# frozen_string_literal: true

FactoryBot.define do
  factory :blockchain do
    sequence(:name) { |n| "cryptocurrency#{n}" }
  end
end
