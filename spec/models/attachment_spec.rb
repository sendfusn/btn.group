# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Attachment, type: :model do
  describe 'ASSOCIATIONS' do
    it { should belong_to(:attachable) }
  end

  describe 'ENUMS' do
    it { should define_enum_for(:identifier).with_values(logo: 0) }
  end
end
