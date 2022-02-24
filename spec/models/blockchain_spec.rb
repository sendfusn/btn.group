# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Blockchain, type: :model do
  let(:blockchain) { build(:blockchain) }

  describe 'ASSOCIATIONS' do
    it { should have_many(:cryptocurrencies).dependent(:restrict_with_exception) }
    it { should have_many(:smart_contracts).dependent(:restrict_with_exception) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:identifier).with_values(secret_network: 0, cosmos: 1, terra: 2, osmosis: 3, sentinel: 4, near: 5) }
  end

  describe 'VALIDATIONS' do
    it { should validate_presence_of(:identifier) }

    context 'when a blockchain exists' do
      before { create(:blockchain) }

      it 'invalidates duplicate identifiers' do
        new_blockchain = build(:blockchain, identifier: described_class.first.identifier)
        expect(new_blockchain.valid?).to be false
      end

      it 'validates unique identifiers' do
        identifier = described_class.identifiers.keys.sample
        new_blockchain = build(:blockchain, identifier: identifier)
        expect(new_blockchain.valid?).to be described_class.find_by(identifier: identifier).nil?
      end
    end
  end

  describe 'INSTANCE METHODS' do
    describe '#gas_and_delay_factor' do
      context 'when latest_block_time absent' do
        it 'returns nil' do
          expect(blockchain.gas_and_delay_factor).to be nil
        end
      end

      context 'when latest_block_time present' do
        before { blockchain.latest_block_time = 7.5 }

        context 'when base_block_time absent' do
          it 'returns nil' do
            expect(blockchain.gas_and_delay_factor).to be nil
          end
        end

        context 'when base_block_time present' do
          before { blockchain.base_block_time = 7.5 }

          context 'when latest_block_time is less than or equal to base_block_time' do
            before { blockchain.latest_block_time = rand(0.1...blockchain.base_block_time) }

            it 'returns 1' do
              expect(blockchain.gas_and_delay_factor).to be 1
            end
          end

          context 'when latest_block_time is greater than base_block_time' do
            it 'returns 1.5' do
              blockchain.latest_block_time = blockchain.base_block_time + 0.1
              expect(blockchain.gas_and_delay_factor).to be 1.5
            end

            it 'returns 2' do
              blockchain.latest_block_time = blockchain.base_block_time * 2 - 0.1
              expect(blockchain.gas_and_delay_factor).to be 2
            end

            it 'returns 2.5' do
              blockchain.latest_block_time = blockchain.base_block_time * 2 + 0.1
              expect(blockchain.gas_and_delay_factor).to be 2.5
            end

            it 'returns 3' do
              blockchain.latest_block_time = blockchain.base_block_time * 3 - 0.1
              expect(blockchain.gas_and_delay_factor).to be 3
            end

            it 'returns 4' do
              blockchain.latest_block_time = blockchain.base_block_time * 4
              expect(blockchain.gas_and_delay_factor).to eq 4
            end
          end
        end
      end
    end
  end
end
