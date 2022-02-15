class AddUniquenessToProtocolIdentifierColumn < ActiveRecord::Migration[6.1]
  def change
    change_column(:protocols, :identifier, :integer, null: false)
    add_index :protocols, :identifier, unique: true
  end
end
