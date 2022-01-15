class CreateAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :attachments do |t|
      t.references :attachable, polymorphic: true, index: true
      t.string :url
      t.string :cloudinary_public_id
      t.integer :identifier

      t.timestamps
    end
  end
end
