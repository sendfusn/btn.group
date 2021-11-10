# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Blockchain, type: :model do
  describe 'ASSOCIATIONS' do
    it { should have_many(:smart_contracts).dependent(:restrict_with_exception) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:identifier).with_values(secret_network: 0) }
  end
end
