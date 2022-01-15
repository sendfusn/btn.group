# frozen_string_literal: true

class Attachment < ApplicationRecord
  # === ASSOCIATIONS ===
  belongs_to :attachable, polymorphic: true

  # === ENUMERABLES ===
  enum identifier: { logo: 0 }

  # === INSTANCE METHODS ===
  def cloudinary_url(options = {})
    return if cloudinary_public_id.blank?

    Cloudinary::Utils.cloudinary_url(cloudinary_public_id, options)
  end
end
