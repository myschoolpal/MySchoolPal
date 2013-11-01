class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def after_sign_in_path_for(user_class)
  user_classes_path
  end
  
  def authorize_admin
    redirect_to(user_classes_path) if current_user.admin != true
    #redirects to previous page
	end
	
  def authorize_teacher
    redirect_to(root_path) if current_user.user_info.teacher != true
    #redirects to previous page
	end
end
