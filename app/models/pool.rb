# frozen_string_literal: true

class Pool < ApplicationRecord
  has_many :cryptocurrency_pools, dependent: :destroy
end
