# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Wallet, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:blockchain) }
  end

  describe 'VALIDATIONS' do
    before { create(:wallet) }

    it { should validate_presence_of(:address) }
    it { should validate_uniqueness_of(:address).ignoring_case_sensitivity }
  end
end
