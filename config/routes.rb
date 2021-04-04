# frozen_string_literal: true

Rails.application.routes.draw do
  get 'aliases/search', to: 'aliases#search'
  resources :aliases, only: %i[index new]
  resources :invoices, only: %i[index new show edit]

  match 'datahub/*path' => 'datahub#index', via: %i[get post put patch delete], defaults: { format: 'json' }

  root 'aliases#search'
end
