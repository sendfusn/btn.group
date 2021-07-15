# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SmartContract, type: :model do
  let(:smart_contract) { build(:smart_contract) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:blockchain) }
  end
end
