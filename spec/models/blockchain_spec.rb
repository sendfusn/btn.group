# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Blockchain, type: :model do
  describe 'ASSOCIATIONS' do
    it { should have_many(:smart_contracts).dependent(:restrict_with_exception) }
  end
end
