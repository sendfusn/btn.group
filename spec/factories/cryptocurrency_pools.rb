# frozen_string_literal: true

FactoryBot.define do
  factory :cryptocurrency_pool do
    cryptocurrency_role { 'deposit' }

    association :cryptocurrency
    association :pool
  end
end
