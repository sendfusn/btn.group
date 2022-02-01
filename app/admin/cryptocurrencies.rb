# frozen_string_literal: true

ActiveAdmin.register Cryptocurrency do
  # === CONFIG ===
  config.sort_order = 'symbol_asc'

  # # === MENU ===
  # menu parent: 'Crypto'

  # === INDEX ===
  index do
    selectable_column
    id_column
    column :symbol
    column :name
    column :blockchain
    column :decimals
    column :price
    column :denom
    column :smart_contract
    column :official
    column :coin_gecko_id
    column :nft
    column :created_at
    column :updated_at
    actions
  end

  filter :name
  filter :symbol
  filter :blockchain
  filter :smart_contract_id
  filter :official
  filter :nft
  filter :price

  # # === SHOW ===
  # show do
  #   attributes_table do
  #     row :identifier
  #     row :name
  #   end
  # end

  # === FORM ===
  form do |f|
    f.inputs do
      f.input :name
      f.input :symbol
      f.input :decimals
      f.input :blockchain
      f.input :smart_contract_id, label: 'Smart contract id'
      f.input :price
      f.input :coin_gecko_id
      f.input :official
      f.input :nft
    end
    f.actions
  end

  # === PERMIT PARAMS ===
  permit_params :blockchain_id, :coin_gecko_id, :smart_contract_id, :decimals, :name, :symbol, :price, :official, :nft
end
