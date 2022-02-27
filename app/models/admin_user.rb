# frozen_string_literal: true

class AdminUser < ApplicationRecord
  # === DEVISE ===
  devise :recoverable, :rememberable, :validatable
end
