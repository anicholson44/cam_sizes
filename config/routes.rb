# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/', to: redirect('/cams')

  resources :cams, only: %i[index]

  namespace :api, constraints: { format: :json } do
    resources :cams, only: %i[index]
  end
end
