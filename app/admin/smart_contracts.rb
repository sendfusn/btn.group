# frozen_string_literal: true

ActiveAdmin.register SmartContract do
  actions :index, :show

  index do
    selectable_column
    id_column
    column :blockchain
    column :address
    column :data_hash
    column :label
    column :created_at
    column :updated_at
    actions
  end
end
