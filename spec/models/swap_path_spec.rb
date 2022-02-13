# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SwapPath, type: :model do
  let(:blockchain) do
    if Blockchain.count.zero?
      create(:blockchain)
    else
      Blockchain.first
    end
  end
  let(:cryptocurrency) { create(:cryptocurrency, blockchain: blockchain, smart_contract: smart_contract) }
  let(:pool_one) { create(:pool, protocol: protocol_one, smart_contract: smart_contract) }
  let(:pool_two) { create(:pool, protocol: protocol_two, smart_contract: smart_contract_two) }
  let(:protocol_one) { create(:protocol) }
  let(:protocol_two) { create(:protocol) }
  let(:smart_contract) { create(:smart_contract, blockchain: blockchain) }
  let(:smart_contract_two) { create(:smart_contract, blockchain: blockchain) }
  let(:swap_path) { build(:swap_path) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:from) }
    it { should belong_to(:to) }
    it { should belong_to(:protocol).optional }
    it { should have_many(:pool_swap_paths).dependent(:destroy) }
    it { should have_many(:pools) }
  end

  describe 'VALIDATIONS' do
    subject { swap_path }

    it { should validate_uniqueness_of(:swap_path_as_string).scoped_to(%i[from_id to_id]).case_insensitive }
    it { should validate_numericality_of(:swap_count).is_greater_than_or_equal_to(1) }
  end

  describe 'CALLBACKS' do
    describe 'before_create' do
      it 'removes spaces before saving swap path as string' do
        unformatted_string = '1, 3, 5, 7, 10'
        swap_path.swap_path_as_string = unformatted_string
        swap_path.save
        expect(swap_path.swap_path_as_string).to eq('1,3,5,7,10')
      end

      describe 'setting a protocol_id' do
        context 'when all the pools are part of the same protocol' do
          before { swap_path.swap_path_as_string = pool_one.id.to_s }

          it "sets the swap path protocol_id to the pool's protocol_id" do
            swap_path.save
            expect(swap_path.protocol_id).to be pool_one.protocol_id
          end
        end

        context 'when all the pools are not from the same protocol' do
          before { swap_path.swap_path_as_string = "#{pool_one.id}, #{pool_two.id}" }

          it 'leaves the protocol_id to nil' do
            swap_path.save
            expect(swap_path.protocol_id).to be nil
          end
        end
      end
    end

    describe 'after_create' do
      it 'creates the pool swap paths related to pools' do
        swap_path.swap_path_as_string = "#{pool_one.id}, #{pool_two.id}"
        swap_path.save
        expect(swap_path.pool_swap_paths.count).to be(2)
        expect(swap_path.pool_swap_paths.first).to eq(PoolSwapPath.find_by(pool: pool_one, position: 0, swap_path: swap_path))
        expect(swap_path.pool_swap_paths.second).to eq(PoolSwapPath.find_by(pool: pool_two, position: 1, swap_path: swap_path))
      end

      it 'calls #set_maximum_tradeable_value' do
        allow(swap_path).to receive(:set_maximum_tradeable_value)
        swap_path.swap_path_as_string = "#{pool_one.id}, #{pool_two.id}"
        swap_path.save
        expect(swap_path).to have_received(:set_maximum_tradeable_value)
      end
    end
  end

  # describe 'INSTANCE METHODS' do
  #   descrive '#net_result_as_usd' do

  #   end
  # end
end
