# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pool, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:smart_contract).optional(true) }
    it { should have_many(:cryptocurrency_pools).dependent(:destroy) }
  end
end
