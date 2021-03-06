class UserClassesController < ApplicationController
  before_action :set_user_class, only: [:show, :edit, :update, :destroy]
	before_filter :authorize_user
	before_filter :goto_dashboard

  # GET /user_classes
  # GET /user_classes.json
  def index
	redirect_to user_infos_path if current_user.admin == true
	
    @user_classes = current_user.timetables.where('class_id IS NOT NULL').first
	
	@pupil_classes = current_user.user_classes
	if uc = @user_classes
	if uc.class_name
	@manage_classes = uc.class_name.id
	else 
	@manage_classes = 0
	end
	else 
	@manage_classes = 0
	end
	
  end

  def import
  UserClass.import(params[:file], current_user)
  redirect_to root_url, notice: "Classes have been linked to Users."
end
  # GET /user_classes/1
  # GET /user_classes/1.json
  def show
  end

  # GET /user_classes/new
  def new
    @user_class = UserClass.new
  end

  # GET /user_classes/1/edit
  def edit
  end

  # POST /user_classes
  # POST /user_classes.json
  def create
    @user_class = UserClass.new(user_class_params)

    respond_to do |format|
      if @user_class.save
        format.html { redirect_to @user_class, notice: 'User class was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user_class }
      else
        format.html { render action: 'new' }
        format.json { render json: @user_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_classes/1
  # PATCH/PUT /user_classes/1.json
  def update
    respond_to do |format|
      if @user_class.update(user_class_params)
        format.html { redirect_to @user_class, notice: 'User class was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_classes/1
  # DELETE /user_classes/1.json
  def destroy
	
    @user_class.destroy
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  def delete_classes
	@user_classes = User.where(id: params[:user_id]).first.user_classes
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_class
      @user_class = UserClass.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_class_params
      params.require(:user_class).permit(:user_id, :class_id)
    end
end
