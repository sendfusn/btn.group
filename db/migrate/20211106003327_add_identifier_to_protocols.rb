class AddIdentifierToProtocols < ActiveRecord::Migration[6.1]
  def change
    add_column :protocols, :identifier, :integer
  end
end
