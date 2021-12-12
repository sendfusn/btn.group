class AddThirdPartyIdentifierToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :third_party_identifier, :string
  end
end
