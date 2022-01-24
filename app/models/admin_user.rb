# frozen_string_literal: true

class AdminUser < ApplicationRecord
  # === DEVISE ===
  devise :recoverable, :rememberable, :validatable
  devise :two_factor_authenticatable, otp_secret_encryption_key: Rails.application.credentials.two_factor_encryption_key
end
