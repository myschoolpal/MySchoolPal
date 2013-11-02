class UserInfosController < ApplicationController
	before_filter :authorize_admin, only: :index
	
  def index
	  if current_user.school_id
	    @year = params[:year]
		if params[:show_pupils].to_i >= 50
		show_pupils = params[:show_pupils].to_i
		else
		show_pupils = 50
		end
		@back_show_pupils = (show_pupils -50)
		@next_show_pupils = (show_pupils +50)
		check_pupil = User.where(school_id: current_user.school_id).includes(:user_info).where("user_infos.pupil=?", true).where("user_infos.year=?", @year)
		@number_pupils = check_pupil.all.size
		if check_pupil
		@pupils = check_pupil.limit(show_pupils).drop(show_pupils - 50)
		end
		@teachers = User.where(school_id: current_user.school_id).includes(:user_info).where("user_infos.teacher=?", true).all
		@admin = User.where(school_id: current_user.school_id).where(admin: true).all
	  else
		redirect_to root_path
	  end
		
		@results = Result.all.to_a

		
	end

  def import
  UserInfo.import(params[:file], current_user)
  redirect_to user_infos_path, notice: "Users imported."
end

  def new
    @user = User.new
	
  end

  def create
      @user_info = UserInfo.new(params[:user_info])
	    if @user_info.save
      redirect_to user_infos_url, :notice => "Successfully created user info."
    else
      render :action => 'new'
    end
  end

  def edit
    @user_info = UserInfo.find(params[:user])
	
  end

  def update
    @user_info = UserInfo.find(params[:id])
	@user_info.user.user_classes.build
	@user_info.user.user_groups.build
	@user_info.user.user_targets.build
    if @user_info.update_attributes(params[:user_info])
	
      redirect_to :back, :notice  => "Successfully updated user info."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
	@user_info = UserInfo.find(params[:user_info])
    @user.destroy
	@user_info.destroy
    redirect_to user_infos_url, :notice => "Successfully destroyed user info."
  end
end
