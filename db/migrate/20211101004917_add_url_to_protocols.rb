class AddUrlToProtocols < ActiveRecord::Migration[6.1]
  def change
    add_column :protocols, :url, :string, null: false
  end
end
