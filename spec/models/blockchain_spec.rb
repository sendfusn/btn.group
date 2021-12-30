# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Blockchain, type: :model do
  describe 'ASSOCIATIONS' do
    it { should have_many(:smart_contracts).dependent(:restrict_with_exception) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:identifier).with_values(secret_network: 0, cosmos: 1, terra: 2, osmosis: 3, sentinel: 4) }
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
        identifier = (described_class.identifiers.values - [described_class.first.identifier]).sample
        new_blockchain = build(:blockchain, identifier: identifier)
        expect(new_blockchain.valid?).to be true
      end
    end
  end
end
