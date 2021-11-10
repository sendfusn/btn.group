# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CryptocurrencyPool, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:cryptocurrency) }
    it { should belong_to(:pool) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:cryptocurrency_role).with_values(deposit: 0, reward: 1, shares: 2) }
  end

  describe 'VALIDATIONS' do
    # before { create(:cryptocurrency_pool) }

    # it { should validate_uniqueness_of(:cryptocurrency_role).scoped_to(%i[cryptocurrency_id pool_id]) }
    it { should validate_presence_of(:cryptocurrency_role) }
  end
end
