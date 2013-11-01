class UserInfosController < ApplicationController
  def index
    @user_infos = UserInfo.all
	@users = User.all
	@results = Result.all.to_a
  end

  def import
  UserInfo.import(params[:file])
  redirect_to root_url, notice: "Users imported."
end

  def new
    @user_info = UserInfo.new
	@user = User.find(params[:user])
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
