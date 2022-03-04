# frozen_string_literal: true

require 'sidekiq/web'
Sidekiq::Web.set :session_secret, Rails.application.credentials[:secret_key_base]

Rails.application.routes.draw do
  authenticate :admin_user do
    mount Sidekiq::Web, at: '/sidekiq', as: 'sidekiq'
  end
  devise_for :admin_users, except: %w[sessions#new session#destroy]

  resources :blockchains, only: :show, defaults: { format: 'json' } do
    get :stats, on: :member, defaults: { format: 'js' }
  end
  resources :cryptocurrencies, only: :index, defaults: { format: 'json' }
  resources :cryptocurrency_pools, only: :update, defaults: { format: 'json' }
  resources :pools, only: :index, defaults: { format: 'json' } do
    get :tvl, on: :collection, defaults: { format: 'js' }
  end
  resources :smart_contracts, only: :index, defaults: { format: 'json' }
  resources :swap_paths, only: :index, defaults: { format: 'json' }
  resources :wallets, only: :update, defaults: { format: 'json' }

  namespace :near do
    get 'smart_contract_interface' => 'pages#smart_contract_interface'
  end

  namespace :secret_network do
    get 'buttcoin/circulating_supply' => 'button#circulating_supply', defaults: { format: 'json' }
    resources :button, only: :index do
      get :circulating_supply, on: :collection, defaults: { format: 'js' }
    end
    get 'address_alias' => 'pages#address_alias'
    get 'block_locker' => 'pages#block_locker'
    get 'butt_lode' => 'pages#butt_lode'
    get 'button_swap' => 'pages#button_swap'
    get 'dex_aggregator' => 'pages#button_swap'
    get 'mount_doom' => 'pages#mount_doom'
    get 'password_manager' => 'pages#password_manager'
    get 'pools' => 'pages#pools'
    get 'pools_admin' => 'pages#pools_admin'
    get 'smart_contract_interface' => 'pages#smart_contract_interface'
    get 'trade_pairs' => 'pages#trade_pairs'
    get 'transactions' => 'pages#transactions'
    get 'why_some_of_our_contracts_are_not_private' => 'pages#why_some_of_our_contracts_are_not_private'
    get 'yield_optimizer' => redirect('secret_network/pools')
  end

  # === DATAHUB REVERSE PROXY ===
  match 'near/datahub/*path' => 'near/datahub#index', via: %i[get put patch delete], defaults: { format: 'json' }
  match 'near/datahub_staging/*path' => 'near/datahub#index_staging', via: %i[get put patch delete],
        defaults: { format: 'json' }
  match 'near/datahub' => 'near/datahub#index', via: :post, defaults: { format: 'json' }
  match 'near/datahub_staging' => 'near/datahub#index_staging', via: :post, defaults: { format: 'json' }
  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'datahub_rpc' => 'datahub#rpc', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'datahub_rpc/*path' => 'datahub#rpc', via: %i[get post put patch delete], defaults: { format: 'json' }
  match 'datahub_staging/*path' => 'datahub#index_staging', via: %i[get post put patch delete],
        defaults: { format: 'json' }

  # SITE PAGES
  get 'brand_assets' => 'application#brand_assets'
  get 'roadmap' => 'application#roadmap'
  root 'application#home'
end
