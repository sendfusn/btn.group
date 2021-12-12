# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SmartContract, type: :model do
  let(:blockchain) { create(:blockchain) }
  let(:subject) { build(:smart_contract, blockchain: blockchain) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:blockchain) }
  end

  describe 'VALIDATIONS' do
    it { should validate_presence_of(:address) }
    it { should validate_presence_of(:label) }
  end
end
