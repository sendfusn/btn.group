# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Protocol, type: :model do
  describe 'ASSOCIATIONS' do
    it { should have_many(:pools).dependent(:restrict_with_exception) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:identifier).with_values(btn_group: 0, secret_swap: 1, sienna: 2) }
  end

  describe 'VALIDATIONS' do
    it { should validate_presence_of(:identifier) }
  end
end
