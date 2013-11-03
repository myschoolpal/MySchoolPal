class UserTargetsController < ApplicationController
  before_action :set_user_target, only: [:show, :edit, :update, :destroy]

  # GET /user_targets
  # GET /user_targets.json
  def index
    @user_targets = UserTarget.all
  end

  # GET /user_targets/1
  # GET /user_targets/1.json
  def show
  end

  def import
  UserTarget.import(params[:file])
  redirect_to root_url, notice: "Products imported."
end
  
  # GET /user_targets/new
  def new
    @user_target = UserTarget.new
  end

  # GET /user_targets/1/edit
  def edit
  end

  def delete_subject_targets
	@user_targets = User.where(id: params[:user_id]).first.user_targets
  end
  
  # POST /user_targets
  # POST /user_targets.json
  def create
    @user_target = UserTarget.new(user_target_params)

    respond_to do |format|
      if @user_target.save
        format.html { redirect_to @user_target, notice: 'User target was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user_target }
      else
        format.html { render action: 'new' }
        format.json { render json: @user_target.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_targets/1
  # PATCH/PUT /user_targets/1.json
  def update
    respond_to do |format|
      if @user_target.update(user_target_params)
        format.html { redirect_to @user_target, notice: 'User target was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user_target.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_targets/1
  # DELETE /user_targets/1.json
  def destroy
    @user_target.destroy
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_target
      @user_target = UserTarget.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_target_params
      params.require(:user_target).permit(:user_id, :subject_id, :target)
    end
end
