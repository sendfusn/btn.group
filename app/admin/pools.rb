# frozen_string_literal: true

ActiveAdmin.register Pool do
  # === PERMIT PARAMS ===
  permit_params :protocol_id, :smart_contract_id, :deadline, :pending_rewards, :total_locked, :apr, :apy
end
