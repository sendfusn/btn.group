# frozen_string_literal: true

ActiveAdmin.register Cryptocurrency do
  # === CONFIG ===
  config.sort_order = 'symbol_asc'

  # # === MENU ===
  # menu parent: 'Crypto'

  # # === INDEX ===
  # index do
  #   column :identifier
  #   column :name
  #   actions
  # end

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
      f.input :smart_contract, collection: SmartContract.all.order(:label), member_label: proc { |sc| "#{sc.label} - #{sc.address}" }
      f.input :decimals
      f.input :name
      f.input :symbol
      f.input :price
      f.input :official
    end
    f.actions
  end

  # === PERMIT PARAMS ===
  permit_params :smart_contract_id, :decimals, :name, :symbol, :price, :official
end
