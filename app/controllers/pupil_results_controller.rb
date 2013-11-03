class PupilResultsController < ApplicationController
  before_action :set_pupil_result, only: [:show, :update, :destroy]
		before_filter :authorize_user
		before_filter :authorize_teacher, only: [:index, :show, :edit, :new]
		before_filter :authorize_correct_teacher, only: [:index, :show, :edit, :new]
  # GET /pupil_results
  # GET /pupil_results.json
  def index
    @class_name = ClassName.where(:id =>params[:class_id]).first.class_name
	col_id = params[:col_id].to_i
	if col_id > 4
	@start_col = ((col_id/7.0).ceil * 7)+1
	else 
	@start_col = 1
	end
	@groups = Group.all
	if s = SubjectClass.where(:class_id => params[:class_id]).first
	@subject = s.subject
	end
	@pupils = UserClass.where(class_id: params[:class_id]).all
	@pupil_result = PupilResult.new
	@title = TitleClass.new	
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
	@user_id = params[:user_id]
	@class_id = params[:class_id]
	@pupil_results = PupilResult.where(user_id: @user_id).where(class_id: @class_id).order("col_id ASC")
	if !@pupil_results.empty?
		@pupil = @pupil_results.first.user
	end
	@titles = TitleClass.where(class_id: @class_id)
	
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
