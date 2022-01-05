# frozen_string_literal: true

ActiveAdmin.register SwapPath do
  actions :index

  filter :from
  filter :to
end
