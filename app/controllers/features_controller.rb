# frozen_string_literal: true

class FeaturesController < ApplicationController
  helper_method :feature

  def show; end

  def feature
    @feature ||= Feature.friendly.find(params[:id])
  end
end
