# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pool, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:pool).optional }
    it { should belong_to(:protocol).optional }
    it { should belong_to(:smart_contract) }
    it { should have_many(:cryptocurrency_pools).dependent(:destroy) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:category).with_values(farm: 0, trade_pair: 1, yield_optimizer: 2, profit_distributor: 3) }
  end

  describe 'VALIDATIONS' do
    before { create(:pool) }

    it { should validate_uniqueness_of(:smart_contract_id) }
  end
end
