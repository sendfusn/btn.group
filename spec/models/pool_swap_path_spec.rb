# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PoolSwapPath, type: :model do
  let(:blockchain) do
    if Blockchain.count.zero?
      create(:blockchain)
    else
      Blockchain.first
    end
  end
  let(:cryptocurrency) { create(:cryptocurrency, blockchain: blockchain, smart_contract: smart_contract) }
  let(:pool) { create(:pool, protocol: protocol, smart_contract: smart_contract) }
  let(:protocol) { create(:protocol) }
  let(:smart_contract) { create(:smart_contract, blockchain: blockchain) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:pool) }
    it { should belong_to(:swap_path) }
  end

  describe 'VALIDATIONS' do
    before { create(:pool_swap_path, pool: pool, swap_path: create(:swap_path, from: cryptocurrency, to: cryptocurrency)) }

    it { should validate_uniqueness_of(:pool_id).scoped_to(%i[position swap_path_id]) }
  end
end
