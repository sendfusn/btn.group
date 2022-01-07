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

  # filter :identifier
  # filter :name

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
      f.input :smart_contract, collection: SmartContract.all.order(:label), member_label: proc { |sc| "#{sc.label} - #{sc.address}" }
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
