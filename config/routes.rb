# frozen_string_literal: true

Rails.application.routes.draw do
  resources :invoices, only: %i[index new show edit]

  root 'application#home'
end
