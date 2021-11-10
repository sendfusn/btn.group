class AddIdentifierToBlockchains < ActiveRecord::Migration[6.1]
  def change
    add_column :blockchains, :identifier, :integer
  end
end
