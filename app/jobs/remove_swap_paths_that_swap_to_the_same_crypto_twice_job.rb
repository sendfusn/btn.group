# frozen_string_literal: true

class RemoveSwapPathsThatSwapToTheSameCryptoTwiceJob < ApplicationJob
  def perform
    swap_paths_to_process = true
    id = 0
    while swap_paths_to_process
      if (sp = SwapPath.where('id > ?', id).order(:id).first)
        id = sp.id
        next if sp.from_id == sp.to_id

        crypto_id_path = sp.crypto_id_path
        crypto_id_path.pop
        sp.destroy! if crypto_id_path.include?(sp.to_id)
      else
        swap_paths_to_process = false
      end
    end
  end
end
