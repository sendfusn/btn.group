# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Feature, type: :model do
  describe 'ENUMS' do
    it { should define_enum_for(:blockchain).with_values(secret_network: 0) }
  end

  describe 'VALIDATIONS' do
    it { should validate_presence_of(:name) }
  end
end
