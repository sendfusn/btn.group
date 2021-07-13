class CreateBlockchains < ActiveRecord::Migration[6.1]
  def change
    create_table :blockchains do |t|
      t.string :name, null: false
 
      t.timestamps
    end
  end
end
