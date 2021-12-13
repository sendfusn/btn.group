# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cryptocurrency, type: :model do
  let(:blockchain) { build(:blockchain) }
  let(:subject) { build(:cryptocurrency, blockchain: blockchain) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:blockchain) }
    it { should belong_to(:smart_contract).optional(true) }
    it { should have_many(:cryptocurrency_pools).dependent(:restrict_with_exception) }
    it { should have_many(:pools) }
  end

  describe 'DELEGATES' do
    it { should delegate_method(:address).to(:smart_contract).allow_nil }
  end

  describe 'VALIDATIONS' do
    before { create(:cryptocurrency, blockchain: blockchain) }

    it { should validate_numericality_of(:decimals).is_greater_than_or_equal_to(0) }
    it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0).allow_nil }
    it { should validate_uniqueness_of(:smart_contract_id).allow_nil }
    it { should validate_uniqueness_of(:symbol).case_insensitive.scoped_to(:smart_contract_id) }
  end

  describe 'CALLBACKS' do
    let(:cryptocurrency) { subject }

    it 'upcases the symbol before save' do
      cryptocurrency.update(symbol: 'butt')
      expect(cryptocurrency.symbol).to eq('BUTT')
    end
  end
end
