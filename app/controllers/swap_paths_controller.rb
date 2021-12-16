# frozen_string_literal: true

class SwapPathsController < ApplicationController
  before_action :authenticate_admin_user!, only: :index

  def index
    @swap_paths = SwapPath.where(from_id: params['from_id'], to_id: params['to_id']).order(:swap_count)
    render json: @swap_paths, methods: :swap_path_as_array, include: { from: {}, to: {} }
  end
end
