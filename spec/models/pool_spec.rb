# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pool, type: :model do
  let(:blockchain) do
    if Blockchain.count.zero?
      create(:blockchain)
    else
      Blockchain.first
    end
  end
  let(:cryptocurrency) { build(:cryptocurrency, blockchain: blockchain) }
  let(:pool) { build(:pool) }
  let(:smart_contract) { build(:smart_contract, blockchain: blockchain) }
  let(:smart_contract_two) { build(:smart_contract, blockchain: blockchain) }

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

    describe 'pool_id' do
      subject { pool }

      context 'when pool is yield_optimizer' do
        before { pool.category = 'yield_optimizer' }

        # Yield optimizer contract must belong to a farm contract
        it { should validate_presence_of(:pool_id) }

        context 'when belongs to non farm pool' do
          it 'raises an error' do
            pool.pool = create(:pool, category: :profit_distributor, smart_contract: smart_contract)
            expect(pool.valid?).to be false
          end
        end

        context 'when belongs to farm pool' do
          it 'is valid' do
            pool.pool = create(:pool, category: :farm, pool: create(:pool, category: :trade_pair, smart_contract: smart_contract_two), smart_contract: smart_contract)
            expect(pool.valid?).to be true
          end
        end
      end

      context 'when pool is farm' do
        before { pool.category = 'farm' }

        context 'when belongs to non trade pair pool' do
          it 'raises an error' do
            pool.pool = create(:pool, category: :profit_distributor, smart_contract: smart_contract)
            expect(pool.valid?).to be false
          end
        end

        context 'when belongs to trade pair' do
          it 'is valid' do
            pool.pool = create(:pool, category: :trade_pair, smart_contract: smart_contract)
            expect(pool.valid?).to be true
          end
        end
      end

      context 'when pool is not yield_optimizer or farm' do
        before { pool.category = (described_class.categories.keys - %w[farm yield_optimizer]).sample }

        # Non yield optimizer contract must not belong to any pool
        it { should validate_absence_of(:pool_id) }
      end
    end
  end

  describe 'INSTANCE METHODS' do
    describe '#update_total_locked' do
      context 'when deposit token amount is nil' do
        before { create(:cryptocurrency_pool, pool: pool, cryptocurrency: cryptocurrency) }

        it 'sets the total_locked to nil' do
          pool.update_total_locked
          expect(pool.total_locked).to be nil
        end
      end

      context 'when deposit token amount is present' do
        before { create(:cryptocurrency_pool, cryptocurrency: cryptocurrency, pool: pool, amount: rand(1_000_000_000).to_s) }

        context 'when cryptocurrency price is nil' do
          before { cryptocurrency.update(price: nil) }

          it 'sets the total_locked to nil' do
            pool.update_total_locked
            expect(pool.total_locked).to be nil
          end
        end

        context 'when cryptocurrency price is present' do
          before { cryptocurrency.update(price: rand(43_000)) }

          it 'sets the total_locked' do
            cp = pool.cryptocurrency_pools.first
            pool.update_total_locked
            expect(pool.total_locked).to eq((cp.cryptocurrency.amount_with_decimals(cp.amount) * cp.cryptocurrency.price).round(2))
          end
        end
      end
    end
  end
end
