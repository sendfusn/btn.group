# frozen_string_literal: true

ActiveAdmin.register Pool do
  index do
    selectable_column
    id_column
    column :protocol
    column :smart_contract do |pool|
      pool.smart_contract.label_formatted
    end
    column :apr
    column :apy
    column :enabled
    column :downcase_data_hash_for_swap_simulation
    column :created_at
    column :updated_at
    actions
  end

  filter :enabled
  filter :smart_contract_id

  # === FORM ===
  form do |f|
    f.inputs do
      f.input :protocol
      f.input :smart_contract, collection: SmartContract.all.order(:label), member_label: proc { |sc| sc.label_formatted }
      f.input :category, as: :select
      f.input :deadline
      f.input :pending_rewards
      f.input :total_locked
      f.input :apr
      f.input :apy
      f.input :pool, collection: Pool.joins(:smart_contract).order('lower(smart_contracts.label) ASC'), member_label: proc { |pool| pool.smart_contract.label_formatted }
      f.input :downcase_data_hash_for_swap_simulation, boolean: true
      f.input :enabled
    end
    f.actions
  end

  # === PERMIT PARAMS ===
  permit_params :apr,
                :apy,
                :category,
                :deadline,
                :downcase_data_hash_for_swap_simulation,
                :enabled,
                :pending_rewards,
                :pool_id,
                :protocol_id,
                :smart_contract_id,
                :total_locked
end
