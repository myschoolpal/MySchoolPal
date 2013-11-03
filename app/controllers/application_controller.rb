class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def after_sign_in_path_for(user_class)
  if current_user.admin == true
	user_infos_path
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
    redirect_to(root_path) if current_user.user_info.teacher != true
    #redirects to previous page
	end

  def authorize_correct_teacher
	redirect_to(user_classes_path) if !current_user.user_classes.find_by_class_id(params[:class_id])
  end
	
  def authorize_user
  
  redirect_to(root_path) if !current_user
  
  end
  
  

end
