# frozen_string_literal: true

Rails.application.routes.draw do
  # ALIAS
  get 'aliases/search', to: 'aliases#search'
  resources :aliases, only: %i[new]

  # COMPOUNDER
  get 'farm-manager', to: 'farm_manager#home'

  # INVOICE
  resources :invoices, only: %i[index new show edit]

  # === DATAHUB REVERSE PROXY ===
  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }

  # SITE PAGES
  get 'about', to: 'application#about'
  get 'buttcoin', to: 'application#buttcoin'
  root 'application#home'
end
