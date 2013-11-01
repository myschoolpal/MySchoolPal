class UsersController < ApplicationController
  
   
	def edit
    @user = User.find(params[:id])

  end

  def update
    @user = User.find(params[:id])
        if @user.update_attributes(params[:user])
      flash[:success] = "Profile updated"

	        redirect_to edit_user_path(@user.id)
    else
	      render :action => 'edit'
    end
  end


def results_overview
@u = User.new
@users = User.all
3.times {@u.pupil_results.build}
end
end