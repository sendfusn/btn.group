# frozen_string_literal: true

Rails.application.routes.draw do
  get 'about', to: 'application#about'
  get 'aliases/search', to: 'aliases#search'
  resources :aliases, only: %i[new]
  get 'farm-manager', to: 'farm_manager#home'
  resources :invoices, only: %i[index new show edit]

  # === DATAHUB REVERSE PROXY ===
  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }

  root 'application#home'
end
