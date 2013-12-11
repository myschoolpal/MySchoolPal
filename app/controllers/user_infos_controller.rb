class UserInfosController < ApplicationController
	before_filter :authorize_admin, only: :index
	
  def index
	  if current_user.school_id
	    @year = params[:year]
		if params[:show_pupils].to_i >= 50
		@show_pupils = params[:show_pupils].to_i
		else
		@show_pupils = 50
		end
		
		check_pupil = User.where(school_id: current_user.school_id).includes(:user_info).where("user_infos.pupil=?", true).where("user_infos.year=?", @year)
		@number_pupils = check_pupil.all.size
		if check_pupil
		@pupils = check_pupil.order("user_infos.surname asc").limit(@show_pupils).drop(@show_pupils - 50)
		end
		@teachers = User.where(school_id: current_user.school_id).includes(:user_info).where("user_infos.teacher=?", true).all
		@admin = User.where(school_id: current_user.school_id).where(admin: true).all
	  else
		redirect_to root_path
	  end
		

		
			
		
	end

  def import
  UserInfo.import(params[:file], current_user)
  redirect_to user_infos_path, notice: "Users imported."
end

  def new
    @user = UserInfo.new
	
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
    @user_info = UserInfo.find(params[:user_infos])
	@new_class = UserClass.new
	@new_group = UserGroup.new
	@new_subject_target = UserTarget.new
  end

  def update
    @user_info = UserInfo.find(params[:id])
	@user_info.user.user_classes.build
	@user_info.user.user_groups.build
	@user_info.user.user_targets.build
	if !params[:new_class][:class_id].empty?	
	@new_class = UserClass.new(params[:new_class])
	@new_class.save
	end
	
	if !params[:new_group][:group_id].empty?	
	@new_group = UserGroup.new(params[:new_group])
	@new_group.save
	end
	
	if !params[:new_subject_target][:subject_id].empty?	&& !params[:new_subject_target][:subject_id].empty?	&& !params[:new_subject_target][:user_id].empty?	
	@new_subject_target = UserTarget.new(params[:new_subject_target])
	@new_subject_target.save
	end
	
  
    if @user_info.update_attributes(params[:user_info])
		@user_info.save!
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
