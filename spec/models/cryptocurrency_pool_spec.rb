# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CryptocurrencyPool, type: :model do
  let(:cp) { create(:cryptocurrency_pool, cryptocurrency_role: 'reward', amount: '5', cryptocurrency: cryptocurrency, pool: pool) }
  let(:protocol) { create(:protocol) }
  let(:smart_contract) { create(:smart_contract, blockchain: blockchain) }
  let(:cryptocurrency) { create(:cryptocurrency, blockchain: blockchain, smart_contract: smart_contract) }
  let(:pool) { create(:pool, protocol: protocol, smart_contract: smart_contract) }
  let(:blockchain) do
    if Blockchain.count.zero?
      create(:blockchain)
    else
      Blockchain.first
    end
  end

  describe 'ASSOCIATIONS' do
    it { should belong_to(:cryptocurrency) }
    it { should belong_to(:pool) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:cryptocurrency_role).with_values(deposit: 0, reward: 1, shares: 2) }
  end

  describe 'VALIDATIONS' do
    before { cp }

    it { should validate_uniqueness_of(:cryptocurrency_role).scoped_to(%i[cryptocurrency_id pool_id]).ignoring_case_sensitivity }
    it { should validate_presence_of(:cryptocurrency_role) }
  end

  describe 'CALLBACKS' do
    describe 'pool.update_total_locked' do
      before { allow(pool).to receive(:update_total_locked) }

      context 'when cryptocurrency role is not deposit' do
        context 'when cp amount is changed' do
          it 'does not call #update_total_locked on pool' do
            cp.update!(amount: cp.amount.to_i + 1)
            expect(pool).not_to have_received(:update_total_locked)
          end
        end
      end

      context 'when cryptocurrency_role is deposit' do
        before { cp.cryptocurrency_role = 'deposit' }

        context 'when cp amount is not changed' do
          it 'does not call #update_total_locked on pool' do
            cp.update!(amount: cp.amount)
            expect(pool).not_to have_received(:update_total_locked)
          end
        end

        context 'when cp amount is changed' do
          it 'calls #update_total_locked on pool' do
            cp.update!(amount: cp.amount.to_i + 1)
            expect(pool).to have_received(:update_total_locked)
          end
        end
      end
    end

    describe 'disabling trade pair' do
      before { allow(pool).to receive(:update!) }

      context 'when cryptocurrency role is not deposit' do
        context 'when cp amount is zero' do
          it 'does not disable pool' do
            cp.update!(amount: '0')
            expect(pool).not_to have_received(:update!).with(enabled: false)
          end
        end
      end

      context 'when cryptocurrency role is deposit' do
        before { cp.cryptocurrency_role = 'deposit' }

        context 'when cp pool is trade_pair' do
          before { cp.pool.update(category: 'trade_pair') }

          context 'when cp amount is not zero' do
            it 'does not disable pool' do
              cp.update!(amount: '1')
              expect(pool).not_to have_received(:update!).with(enabled: false)
            end
          end

          context 'when cp amount is zero' do
            it 'disables pool' do
              cp.update!(amount: '0')
              expect(pool).to have_received(:update!).with(enabled: false)
            end
          end
        end
      end
    end
  end
end
