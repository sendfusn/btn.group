# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cryptocurrency, type: :model do
  subject { build(:cryptocurrency, blockchain: blockchain) }

  let(:blockchain) { build(:blockchain) }
  let(:cryptocurrency) { build(:cryptocurrency, blockchain: blockchain, decimals: 2) }
  let(:pool) { create(:pool) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:blockchain) }
    it { should belong_to(:smart_contract).optional(true) }
    it { should have_many(:attachments).dependent(:destroy) }
    it { should have_many(:cryptocurrency_pools).dependent(:restrict_with_exception) }
    it { should have_many(:pools) }
  end

  describe 'DELEGATES' do
    it { should delegate_method(:address).to(:smart_contract).allow_nil }
  end

  describe 'VALIDATIONS' do
    before { create(:cryptocurrency, blockchain: blockchain) }

    it { should validate_numericality_of(:decimals).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:decimals) }
    it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0).allow_nil }
    it { should validate_uniqueness_of(:smart_contract_id).allow_nil }
    it { should validate_uniqueness_of(:symbol).case_insensitive.scoped_to(:smart_contract_id) }
  end

  describe 'CALLBACKS' do
    # Not sure why .to have_received just won't work in this situation
    describe 'after_save' do
      before do
        create(:cryptocurrency_pool, cryptocurrency: cryptocurrency, pool: pool, amount: '1')
        allow(pool).to receive(:update_total_locked)
      end

      context 'when price is not present' do
        it 'does not call #update_total_locked on any associated trade pairs' do
          cryptocurrency.update!(price: nil)
          expect(cryptocurrency.pools.first.total_locked).to eq 0
        end
      end

      context 'when price is present' do
        context 'when price has changed' do
          it 'calls #update_total_locked on any associated trade pairs' do
            cryptocurrency.update!(price: 100)
            expect(cryptocurrency.pools.first.total_locked).to eq 1
          end
        end

        context 'when price has not changed' do
          it 'does not call #update_total_locked on any associated trade pairs' do
            cryptocurrency.update!(price: 55)
            expect(cryptocurrency.pools.first.total_locked).to eq 0.55
          end
        end
      end
    end

    describe 'before_save' do
      it 'downcases the coin_gecko_id before save' do
        cryptocurrency.update(coin_gecko_id: 'COIN_GECKO_ID')
        expect(cryptocurrency.coin_gecko_id).to eq 'coin_gecko_id'
      end

      it 'upcases the symbol before save' do
        cryptocurrency.update(symbol: 'butt')
        expect(cryptocurrency.symbol).to eq('BUTT')
      end
    end
  end

  describe 'INSTANCE METHODS' do
    describe '#amount_as_usd' do
      it 'returns the amount as usd' do
        cryptocurrency.price = 5.55
        cryptocurrency.decimals = 5
        expect(cryptocurrency.amount_as_usd(100_000)).to eq(5.55)
      end
    end

    describe '#amount_with_decimals' do
      it 'applies the cryptocurrencies decimals to the amount' do
        cryptocurrency.decimals = 5
        expect(cryptocurrency.amount_with_decimals('10000')).to eq(0.1)
      end
    end
  end
end
