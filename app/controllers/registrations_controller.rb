
class RegistrationsController < Devise::RegistrationsController

  protected

    def after_update_path_for(resource)
      if current_user.admin == true
		user_infos_path
	  else
		user_classes_path
	  end
    end
end

