# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pool, type: :model do
  let(:pool) { build(:pool) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:pool).optional }
    it { should belong_to(:protocol).optional }
    it { should belong_to(:smart_contract) }
    it { should have_many(:cryptocurrency_pools).dependent(:destroy) }
    it { should have_many(:pool_swap_paths).dependent(:destroy) }
    it { should have_many(:swap_paths) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:category).with_values(farm: 0, trade_pair: 1, yield_optimizer: 2, profit_distributor: 3) }
  end

  describe 'VALIDATIONS' do
    before { create(:pool) }

    it { should validate_uniqueness_of(:smart_contract_id) }
    it { should_not validate_presence_of(:enabled) }

    context 'when pool is #pseudo_wrap_pool?' do
      subject { pool }

      before do
        allow(pool).to receive(:pseudo_wrap_pool?).and_return(true)
      end

      it { should validate_presence_of(:enabled) }
    end

    context 'when pool is #trade_pair_without_liquidity?' do
      subject { pool }

      before do
        allow(pool).to receive(:trade_pair_without_liquidity?).and_return(true)
      end

      it { should validate_absence_of(:enabled) }
    end
  end
end
