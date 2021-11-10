# frozen_string_literal: true

FactoryBot.define do
  factory :blockchain do
    identifier { 0 }
    sequence(:name) { |n| "cryptocurrency#{n}" }
  end
end
