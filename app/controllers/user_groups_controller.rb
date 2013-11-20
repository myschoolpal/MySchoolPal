class UserGroupsController < ApplicationController
  before_action :set_user_group, only: [:show, :edit, :update, :destroy]
		before_filter :authorize_teacher
  # GET /user_groups
  # GET /user_groups.json
  def index
    @user_groups = UserGroup.all
  end
  
  def gender_analysis
  
	  @show_menu = 1
	  if params[:start_col]
		@start_col = params[:start_col].to_i
	  else
		@start_col = 1
	  end
	  @class_id = params[:class_id]
	  @class_name = ClassName.where(id: @class_id).first
	  if s = @class_name.subject
	  @subject = s.subject
	  else 
	  @subject = ""
	  end
	  @col_id = params[:col_id]
	  if params[:gender]
	  @gender = params[:gender]
	  else
	  @gender = 'F'
	  end
	  
	@pupils = UserClass.where(class_id: params[:class_id]).all
	  if @gender=='M'
	  @group = 'Boys'
	  else
	  @group = 'Girls'
	  end
	  
	  
  
		@titles = TitleClass.where(:class_id=>@class_id).all
  end

  def group_analysis
	
	  @show_menu = 1
	  if params[:start_col]
		@start_col = params[:start_col].to_i
	  else
		@start_col = 1
	  end
	  @group_id = params[:group_id]
	  @class_id = params[:class_id]
	  @class_name = ClassName.find(@class_id)
	  @subject = 'P'
	  @col_id = params[:col_id]
	  
	  @pupils = UserGroup.where(group_id: @group_id).all
	  @group = Group.where(id: @group_id).first.group
	  
	  
	   if s = SubjectClass.where(:class_id => params[:class_id]).first
			@s = s.subject
			if @s
				@subject =@s.subject
			end
		end
		@titles = TitleClass.where(:class_id=>@class_id).all
  end

  def delete_groups
	@user_groups = User.where(id: params[:user_id]).first.user_groups
  end
  
  def import
  UserGroup.import(params[:file], current_user)
  redirect_to :back, notice: "Groups have been linked to users"
end

  # GET /user_groups/1
  # GET /user_groups/1.json
  def show
  end

  # GET /user_groups/new
  def new
    @user_group = UserGroup.new
  end

  # GET /user_groups/1/edit
  def edit
  end

  # POST /user_groups
  # POST /user_groups.json
  def create
    @user_group = UserGroup.new(user_group_params)

    respond_to do |format|
      if @user_group.save
        format.html { redirect_to @user_group, notice: 'User group was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user_group }
      else
        format.html { render action: 'new' }
        format.json { render json: @user_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_groups/1
  # PATCH/PUT /user_groups/1.json
  def update
    respond_to do |format|
      if @user_group.update(user_group_params)
        format.html { redirect_to @user_group, notice: 'User group was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_groups/1
  # DELETE /user_groups/1.json
  def destroy
    @user_group.destroy
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_group
      @user_group = UserGroup.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_group_params
      params.require(:user_group).permit(:user_id, :group_id)
    end
end
