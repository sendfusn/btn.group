# frozen_string_literal: true

Rails.application.routes.draw do
  resources :features, only: :index

  namespace :near do
    resources :smart_contract_interface, only: :index
  end

  namespace :secret_network do
    # INVOICE
    # resources :invoices, only: %i[index new show edit]
    # resources :block_locker, only: %i[index new]
    resources :buttcoin, only: :index
    resources :address_alias, only: %i[index new]
    resources :profit_distributor, only: %i[index]
    resources :smart_contract_interface, only: :index
    resources :transactions, only: :index
    resources :yield_optimizer, only: :index
  end

  # === DATAHUB REVERSE PROXY ===
  match 'near/datahub/*path' => 'near/datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'near/datahub_staging/*path' => 'near/datahub#index_staging', via: %i[get post put patch delete],
        defaults: { format: 'json' }
  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'datahub_staging/*path' => 'datahub#index_staging', via: %i[get post put patch delete],
        defaults: { format: 'json' }

  # SITE PAGES
  get 'blog' => 'application#blog'
  get 'roadmap' => 'application#roadmap'
  root 'application#home'
end
