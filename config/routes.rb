# frozen_string_literal: true

require 'sidekiq/web'
Sidekiq::Web.set :session_secret, Rails.application.credentials[:secret_key_base]

Rails.application.routes.draw do
  authenticate :admin_user do
    mount Sidekiq::Web, at: '/sidekiq', as: 'sidekiq'
  end
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  resources :cryptocurrencies, only: :index, defaults: { format: 'json' }
  resources :features, only: :index
  resources :smart_contracts, only: :index, defaults: { format: 'json' }

  namespace :near do
    resources :smart_contract_interface, only: :index
  end

  namespace :secret_network do
    resources :address_alias, only: %i[index new]
    resources :block_locker, only: :index
    resources :buttcoin, only: :index
    get 'buttcoin/circulating_supply', defaults: { format: 'json' }
    resources :mount_doom, only: :index
    resources :smart_contract_interface, only: :index
    resources :transactions, only: :index
    resources :yield_optimizer, only: :index

    get 'dex_aggregator' => 'pages#dex_aggregator'
    get 'why_some_of_our_contracts_are_not_private' => 'pages#why_some_of_our_contracts_are_not_private'
  end

  # === DATAHUB REVERSE PROXY ===
  match 'near/datahub/*path' => 'near/datahub#index', via: %i[get put patch delete], defaults: { format: 'json' }
  match 'near/datahub_staging/*path' => 'near/datahub#index_staging', via: %i[get put patch delete],
        defaults: { format: 'json' }
  match 'near/datahub' => 'near/datahub#index', via: :post, defaults: { format: 'json' }
  match 'near/datahub_staging' => 'near/datahub#index_staging', via: :post, defaults: { format: 'json' }
  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'datahub_staging/*path' => 'datahub#index_staging', via: %i[get post put patch delete],
        defaults: { format: 'json' }

  # SITE PAGES
  get 'brand_assets' => 'application#brand_assets'
  get 'roadmap' => 'application#roadmap'
  root 'application#home'
end
