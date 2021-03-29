# frozen_string_literal: true

Rails.application.routes.draw do
  resources :aliases, only: %i[index new]
  resources :invoices, only: %i[index new show edit]

  get 'aliases/search', to: 'aliases#search'

  root 'aliases#search'
end
