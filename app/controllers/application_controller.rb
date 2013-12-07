class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
 before_filter :configure_permitted_parameters, if: :devise_controller?
  protect_from_forgery with: :exception
  
  def after_sign_in_path_for(user_class)
  if current_user.admin == true
	user_infos_path(user_info:true)
  else
  user_classes_path
  end
  end
  
  def after_update_path_for(resource)
  user_classes_path
end
  
  def authorize_admin
    redirect_to(user_classes_path) if current_user.admin != true
    #redirects to previous page
	end
	
  def authorize_teacher
	if current_user
		if current_user.admin !=true
			if current_user.user_info
				redirect_to(root_path) if current_user.user_info.teacher != true
			else
			redirect_to(root_path)
			end
    	end
	else
			redirect_to(root_path)
	end
  end
  def authorize_correct_teacher
	if current_user
		if current_user.admin !=true
			redirect_to(user_classes_path) if !current_user.timetables.find_by_class_id(params[:class_id])
		end
	else
		redirect_to(root_path)
	end
  end
	
  def authorize_user
  
  redirect_to(root_path) if !current_user
  
  end
  
	 protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) do |u|
        u.permit :login, :username, :email, :password, :password_confirmation
      end
    devise_parameter_sanitizer.for(:sign_in) { |u| u.permit(:username, :email, :password, :remember_me) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:username, :email, :password, :password_confirmation, :current_password) }
  end

end
