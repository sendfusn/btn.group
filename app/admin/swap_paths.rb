# frozen_string_literal: true

ActiveAdmin.register SwapPath do
  actions :index
  config.sort_order = "arbitrage_profit_desc"

  index do
    id_column
    column :from
    column :to
    column :swap_path_as_string
    column :maximum_tradeable_value
    column :protocol
    column :arbitrage_amount do |swap_path|
      swap_path.from.amount_with_decimals(swap_path.arbitrage_amount)
    end
    column :arbitrage_profit
    column :created_at
    column :updated_at
    actions
  end

  filter :from
  filter :to
  filter :arbitrage_amount
  filter :arbitrage_profit
end
