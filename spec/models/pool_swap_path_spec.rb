# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PoolSwapPath, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:pool) }
    it { should belong_to(:swap_path) }
  end

  describe 'VALIDATIONS' do
    it { should validate_uniqueness_of(:pool_id).scoped_to(%i[position swap_path_id]) }
  end
end
