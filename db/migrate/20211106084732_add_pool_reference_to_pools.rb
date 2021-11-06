class AddPoolReferenceToPools < ActiveRecord::Migration[6.1]
  def change
    add_reference :pools, :pool, index: true
  end
end
