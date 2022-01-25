class AddSwapSimulationFunctionNameToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :swap_simulation_function_name, :integer
  end
end
