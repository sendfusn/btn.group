# frozen_string_literal: true

ActiveAdmin.register Pool do
  # === FORM ===
  form do |f|
    f.inputs do
      f.input :protocol
      f.input :smart_contract, collection: SmartContract.all.order(:label), member_label: proc { |sc| "#{sc.label} - #{sc.address}" }
      f.input :deadline
      f.input :pending_rewards
      f.input :total_locked
      f.input :apr
      f.input :apy
    end
    f.actions
  end

  # === PERMIT PARAMS ===
  permit_params :protocol_id, :smart_contract_id, :deadline, :pending_rewards, :total_locked, :apr, :apy
end
