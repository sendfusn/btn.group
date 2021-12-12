class AddUniqueIndexToBlockchainsIdentifier < ActiveRecord::Migration[6.1]
  def change
    add_index :blockchains, :identifier, unique: true
  end
end
