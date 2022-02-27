# frozen_string_literal: true

class AdminUser < ApplicationRecord
  # === DEVISE ===
  devise :database_authenticatable, :rememberable, :validatable
end
