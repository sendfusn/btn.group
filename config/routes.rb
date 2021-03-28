# frozen_string_literal: true

Rails.application.routes.draw do
  resources :aliases, only: %i[index show]
  resources :invoices, only: %i[index new show edit]

  get 'secret-alias', to: 'application#secret_alias'

  root 'application#home'
end
