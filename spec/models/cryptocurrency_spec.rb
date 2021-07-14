# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cryptocurrency, type: :model do
  describe 'VALIDATIONS' do
    it { should validate_numericality_of(:decimals).is_greater_than_or_equal_to(0) }
    it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0) }
  end
end
