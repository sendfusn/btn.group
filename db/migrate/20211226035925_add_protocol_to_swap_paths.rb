class AddProtocolToSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_reference :swap_paths, :protocol, index: true
  end
end
