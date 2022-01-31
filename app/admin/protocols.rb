# frozen_string_literal: true

ActiveAdmin.register Protocol do
  # === PERMIT PARAMS ===
  permit_params :name, :url

  filter :name
end
