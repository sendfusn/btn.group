# frozen_string_literal: true

FactoryBot.define do
  factory :admin_user do
    sequence(:email) { |n| "admin_user#{n}@btn.group" }
    sequence(:password) { |n| "ButtButtButtButtButtt#{n}!" }
  end
end
