# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SwapPath, type: :model do
  let(:swap_path) { build(:swap_path) }

  describe 'ASSOCIATIONS' do
    it { should belong_to(:from) }
    it { should belong_to(:to) }
  end

  describe 'VALIDATIONS' do
    it { should validate_uniqueness_of(:swap_path_as_string).scoped_to(%i[from_id to_id]) }
  end

  describe 'CALLBACKS' do
    it 'removes spaces before saving' do
      unformatted_string = '1, 3, 5, 7, 10'
      swap_path.swap_path_as_string = unformatted_string
      swap_path.save
      expect(swap_path.swap_path_as_string).to eq('1,3,5,7,10')
    end
  end
end
