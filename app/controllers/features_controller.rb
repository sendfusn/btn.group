# frozen_string_literal: true

class FeaturesController < ApplicationController
  helper_method :feature

  def block_locker_new
    params[:id] = 'block-locker'
  end

  def show; end

  def feature
    @feature ||= Feature.friendly.find(params[:id])
  end
end
