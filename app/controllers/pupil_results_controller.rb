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
	c = ClassName.where(:id =>params[:class_id]).first
	@class_name = c.class_name
	
	@col_id = params[:col_id].to_i
	if @col_id > 4
	@start_col = ((@col_id/7.0).ceil * 7)+1
	else 
	@start_col = 1
	end
	@groups = Group.where(school_id: current_user.school_id).all
	 if s = c.subject
	@subject =s.subject
	end
	
	@pupils = UserClass.where(class_id: params[:class_id]).all
	
	@pupil_result = PupilResult.new
	@title = TitleClass.new	
	@user_classes = current_user.timetables.where('class_id IS NOT NULL').select(:class_id).uniq
	locked = params[:locked]
	if locked == "true"
	@locked = true
	else
	@locked = false
	end
  end
  
   def aps_index
	
	@class_id = params[:class_id]
	
	@c= ClassName.where(:id =>params[:class_id]).first
	@class_name = @c.class_name
	@col_id = params[:col_id].to_i
	if @col_id > 4
	@start_col = ((@col_id/7.0).ceil * 7)+1
	else 
	@start_col = 1
	end
	@groups = Group.all
	 if @c.subject
	 @subject = @c.subject.subject
	 end
	@pupils = UserClass.where(class_id: params[:class_id]).all
	@pupil_result = PupilResult.new
	@title = TitleClass.new	
	@user_classes = current_user.timetables.where('class_id IS NOT NULL').select(:class_id).uniq
	locked = params[:locked]
	if locked == "true"
	@locked = true
	else
	@locked = false
	end
  end
  
  
  def subject_choice
	@subjects = Subject.where(school_id: current_user.school_id).all
  end
  def year_analysis
	
	@above = Array.new
	@on_track = Array.new
	@one_below = Array.new
	@below = Array.new
	@levels =Array.new
	
	@key_stage = params[:key_stage]
	@year_id = params[:year_id]
	@group_id = params[:group_id]
	@class_id = params[:class_id]
	@col_id = params[:col_id]
	@subject_id = params[:subject_id]
	if params[:locked] == "true"
		@locked = true
	else
		@locked = false
	end
	if params[:aps] == "true"
		@aps = true
	else
		@aps =false
	end
	@subjects = Subject.where(school_id: current_user.school_id).all
	@groups = Group.where(school_id: current_user.school_id).all
	@year = Hash.new
	if current_user.school.secondary == true
		@year = [7,8,9,10,11,12,13]
	end
	if current_user.school.primary == true
		@year = [1,2,3,4,5,6]
	end
	@classes = ClassName.where(subject_id: @subject_id.to_i).where(year_id: @year_id)
	
	@u = User.includes(:user_info).where("user_infos.year" => @year_id).joins(:pupil_results).where("pupil_results.col_id" =>@col_id).
	joins(:class_names).where("class_names.subject_id" => @subject_id).all
	if @group_id
	@u = User.includes(:user_info).where("user_infos.year" => @year_id).joins(:pupil_results).where("pupil_results.col_id" =>@col_id).
	joins(:class_names).where("class_names.subject_id" => @subject_id).includes(:user_groups).where("user_groups.group_id" => @group_id).all
	end
	if @class_id
	@u = User.includes(:user_info).where("user_infos.year" => @year_id).joins(:pupil_results).where("pupil_results.col_id" =>@col_id).
	joins(:class_names).where("class_names.subject_id" => @subject_id).where("class_names.id" => @class_id).all
	end
	
	 
 end
 
 def levels_progress
 @levels =Array.new
 @above = Array.new
	@on_track = Array.new
	@one_below = Array.new
	@below = Array.new
	
 @class_id = params[:class_id]
 @key_stage = params[:key_stage]
 if params[:aps] == "true"
 @aps = true
 else
 @aps = false
 end
 if params[:locked] == "true"
	@locked = true
	else
	@locked = false
	end
 @titles = TitleClass.where(:class_id=>@class_id)
 @col_id = params[:col_id]
 @u = User.includes(:user_info).where("user_infos.pupil" => true).includes(:user_classes).where("user_classes.class_id" => @class_id).order("user_infos.surname ASC").all
 if c = ClassName.where(id: @class_id).first
 if s = c.subject
 @subject = s.subject
 @subject_id = s.id
 end
 @class = c.class_name
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
			if r = Result.where(:grade => @pupilresult.result_id.downcase).first || r = Result.where(:grade => @pupilresult.result_id.upcase).first
				@pupilresult.result_id = r.id
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
	if params[:locked] == "true"
	@locked = true
	else
	@locked = false
	end
	@pupil_results = PupilResult.where(user_id: @user_id).where(locked: @locked).where(class_id: @class_id).order("col_id ASC")
	if !@pupil_results.empty?
		@pupil = @pupil_results.first.user
	end
	
	@titles = TitleClass.where(class_id: @class_id).where(locked:@locked)
	if @class_name.subject
	 @subject =@class_name.subject.subject
	 end
  end
  
  def my_results
	@user_id = current_user.id
	@pupil_classes = current_user.user_classes
	@class_id = params[:class_id]
	@class_name = ClassName.find(@class_id)
	if params[:locked] == "true"
	@locked = true
	else
	@locked = false
	end
	@pupil_results = PupilResult.where(user_id: @user_id).where(locked: @locked).where(class_id: @class_id).order("col_id ASC")
	if !@pupil_results.empty?
		@pupil = @pupil_results.first.user
	end
	
	@titles = TitleClass.where(class_id: @class_id).where(locked:@locked)
	 if @class_name.subject
	 @subject =@class_name.subject.subject
	 end
  end
  
  def delete_many_results
  PupilResult.where(:col_id=>params[:col_id]).where(:class_id=>params[:class_id]).where(locked:false).delete_all
  TitleClass.where(:col_id=>params[:col_id]).where(:class_id=>params[:class_id]).where(locked:false).delete_all
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

  	@c = ClassName.where(:id =>params[:class_id]).first
  if s = @c.subject
	@subject =s.subject
	end
  @pupils = UserClass.where(class_id: params[:class_id]).all
  @pupil_result = PupilResult.new
  locked = params[:locked]
	if locked == "true"
	@locked = true
	else
	@locked = false
	end
  @title = TitleClass.new
  end
  
  def edit_aps
  @col = params[:id]
  @class_id =  params[:class_id]
  @pupils = UserClass.where(class_id: params[:class_id]).all
  @pupil_result = PupilResult.new
  locked = params[:locked]
	if locked == "true"
	@locked = true
	else
	@locked = false
	end
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
