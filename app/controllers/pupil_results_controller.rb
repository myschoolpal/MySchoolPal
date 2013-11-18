class PupilResultsController < ApplicationController
  before_action :set_pupil_result, only: [:show, :update, :destroy]
		before_filter :authorize_user
		before_filter :authorize_teacher, only: [:index, :show, :edit, :new]
		before_filter :authorize_correct_teacher, only: [:index, :show, :edit, :new]
		
  # GET /pupil_results
  # GET /pupil_results.json
  def index
	@show_menu = 1
	@class_id = params[:class_id]
	if params[:show]
	@show = params[:show]
	else
	@show=false
	end
	@class_name = ClassName.where(:id =>params[:class_id]).first.class_name
	
	@col_id = params[:col_id].to_i
	if @col_id > 4
	@start_col = ((@col_id/7.0).ceil * 7)+1
	else 
	@start_col = 1
	end
	@groups = Group.all
	 if s = SubjectClass.where(:class_id => params[:class_id]).first
	@s = s.subject
	if @s
	@subject =@s.subject
	end
	end
	@pupils = UserClass.where(class_id: params[:class_id]).all
	@pupil_result = PupilResult.new
	@title = TitleClass.new	
	@user_classes = current_user.user_classes.all
  end
  
  def subject_choice
	@subjects = Subject.all
  end
  def year_analysis
	@year_id = params[:year_id]
	@group_id = params[:group_id]
	@class_id = params[:class_id]
	@col_id = params[:col_id]
	@subject_id = params[:subject_id]
	@subjects = Subject.all
	@groups = Group.all
	@year = Hash.new
	if current_user.school.secondary == true
		@year = [7,8,9,10,11,12,13]
	end
	if current_user.school.primary == true
		@year = [1,2,3,4,5,6]
	end
	
	
	@u = User.includes(:user_info).where("user_infos.year" => @year_id).joins(:pupil_results).where("pupil_results.col_id" =>@col_id).
	joins(:class_names).where("class_names.subject_id" => @subject_id).all
	if @group_id
	@u = User.includes(:user_info).where("user_infos.year" => @year_id).joins(:pupil_results).where("pupil_results.col_id" =>@col_id).
	joins(:class_names).where("class_names.subject_id" => @subject_id).includes(:user_groups).where("user_groups.group_id" => @group_id).all
	end
 end
 
 def levels_progress
 @class_id = params[:class_id]
 @titles = TitleClass.where(:class_id=>@class_id).all
 @col_id = params[:col_id]
 @u = User.includes(:user_classes).where("user_classes.class_id" => @class_id).all
 if c = ClassName.where(id: @class_id).first
 @subject = c.subject.subject
 @class = c.class_name
 @subject_id = c.subject_id
 end
 end
  # GET /pupil_results/1
  # GET /pupil_results/1.json
  def show
  end

  # GET /pupil_results/new
  def new
    @pupil_result = PupilResult.new
	@title = TitleClass.new
  end
  
  def update_all_results
	if params['r']
		params['r'].each do |id|
			@pupilresult = PupilResult.new(id)	
			if Result.where(:grade => @pupilresult.result_id).first
				@pupilresult.result_id = Result.where(:grade => @pupilresult.result_id).first.id
				@pupilresult.save
			end
		end
	end
	if params['title']
		params['title'].each do |id|
			@title = TitleClass.new(id)	
			if @title.title
				@title.save
			end
		end
	end
	
	if params['title_update']
		params['title_update'].keys.each do |id|
			@title_update = TitleClass.find(id)
			@title_update.update_attributes(params['title_update'][id])
		end
	end
	
	if params['update']
		params['update'].keys.each do |id|
			@pupil_result = PupilResult.find(id)
			@pupil_result.update_attributes(params['update'][id])
		end
	end
	redirect_to :back
  end
  
  def personal_analysis
	@show_menu = 1
	@user_id = params[:user_id]
	@class_id = params[:class_id]
	@class_name = ClassName.find(@class_id)
	@pupil_results = PupilResult.where(user_id: @user_id).where(class_id: @class_id).order("col_id ASC")
	if !@pupil_results.empty?
		@pupil = @pupil_results.first.user
	end
	@titles = TitleClass.where(class_id: @class_id)
	 if s = SubjectClass.where(:class_id => params[:class_id]).first
	@s = s.subject
		if @s
			@subject =@s.subject
		end
	end
  end
  def delete_many_results
  PupilResult.where(:col_id=>params[:col_id]).where(:class_id=>params[:class_id]).delete_all
  TitleClass.where(:col_id=>params[:col_id]).where(:class_id=>params[:class_id]).delete_all
  redirect_to :back
  end
  
  def edit_many_results
  @col = params[:col_id]
  @class_id = params[:class_id]
  @pupils = UserClass.where(class_id: params[:class_id]).all
  @pupil_result = PupilResult.new
  @title = TitleClass.new
  end
  # GET /pupil_results/1/edit
  def edit
  @col = params[:id]
  @class_id =  params[:class_id]
  @pupils = UserClass.where(class_id: params[:class_id]).all
  @pupil_result = PupilResult.new
  @title = TitleClass.new
  end

  # POST /pupil_results
  # POST /pupil_results.json
  def create
    @pupil_result = PupilResult.new(params[:pupil_result])
    respond_to do |format|
      if @pupil_result.save
        format.html { redirect_to @pupil_result, notice: 'Pupil result was successfully created.' }
        format.json { render action: 'show', status: :created, location: @pupil_result }
      else
        format.html { render action: 'new' }
        format.json { render json: @pupil_result.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pupil_results/1
  # PATCH/PUT /pupil_results/1.json
  def update
    respond_to do |format|
      if @pupil_result.update(pupil_result_params)
        format.html { redirect_to @pupil_result, notice: 'Pupil result was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @pupil_result.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pupil_results/1
  # DELETE /pupil_results/1.json
  def destroy
    @pupil_result.destroy
    respond_to do |format|
      format.html { redirect_to pupil_results_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pupil_result
      @pupil_result = PupilResult.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def pupil_result_params
      params.require(:pupil_result).permit(:user_id, :class_id, :result, :col_id)
    end
end
