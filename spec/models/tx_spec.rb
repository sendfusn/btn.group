# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tx, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:cryptocurrency) }
    it { should belong_to(:from) }
    it { should belong_to(:to) }
  end

  describe 'VALIDATIONS' do
    it { should validate_presence_of(:identifier) }
    it { should validate_uniqueness_of(:identifier).scoped_to(:cryptocurrency_id) }
  end
end
