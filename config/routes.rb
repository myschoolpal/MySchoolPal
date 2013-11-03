MSP::Application.routes.draw do  get "static_pages/home"
  get "static_pages/about"
  get "static_pages/contact"
  get "static_pages/help"
  
  	match 'pupil_results' => 'pupil_results#update_all_results', :as => :update_all_results, :via => :put
	match 'delete_many_results' => 'pupil_results#delete_many_results', :as => :delete_many_results, :via => :put
	match 'edit_many_results' => 'pupil_results#edit_many_results', :as => :edit_many_results, :via => :put
	get 'users/results_overview', to: 'users#results_overview', as: 'results_overview'
	get 'user_groups/group_analysis', to: 'user_groups#group_analysis', as: 'group_analysis'
	get 'pupil_results/personal_analysis', to: 'pupil_results#personal_analysis', as: 'personal_analysis'
	
  resources :results
  resources :class_names do
  collection do 
  post :import 
  get 'delete_many_cl'
  end
  end
  resources :subjects do
  collection { post :import }
  end
  resources :pupil_results do
  collection { post :import }
  end
  resources :subject_classes do
  collection { post :import }
  end
  resources :title_classes do
  collection { post :import }
  end
  resources :user_classes do
  collection do
  post :import
  get 'delete_classes'
  end
  end
  resources :user_groups do
  collection do
  post :import
  get 'delete_groups'
  end
  end
  resources :user_targets do
  collection do
  post :import
  get 'delete_subject_targets'
  end
  end
  resources :groups do
  collection { post :import }
  end
  
  resources :user_infos do
  collection { post :import }
  end
  
  devise_for :users, :controllers => { :registrations => :registrations } do
  collection { post :import }
  end
  resources :users
  
  root :to => 'static_pages#home'
  
  
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
