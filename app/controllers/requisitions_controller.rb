class RequisitionsController < ApplicationController
  before_action :set_requisition, only: [:show, :edit, :update, :destroy]

  # GET /requisitions
  # GET /requisitions.json
  def index

  @requisitions = Requisition.all
  end
  
  def add_requisition
  @week = params[:week]
  if @week
	@week = @week.to_i
	else 
	@week = 1
	end
  @wb_id = params[:wb_id]
  end

  # GET /requisitions/1
  # GET /requisitions/1.json
  def show
  end
  
  def tech_view
  @wb_id = params[:wb_id]
  @week_beginning = Wb.find(@wb_id).week_beginning
  @req = Requisition.where(school_id: current_user.school_id).where(wb_id: @wb_id).order("room_id ASC").all
  @room_array = Array.new
  @req.each do |r|
  @room_array << r.room_id
  @room_array = @room_array.uniq
  
  end
  end
  
  def tech_week_choice
  
  end

  # GET /requisitions/new
  def new
    @requisition = Requisition.new
	@room_id = params[:room_id]
	@period_id = params[:period_id]
	@day_id = params[:day_id]
	@class_id = params[:class_id]
	@wb_id = params[:wb_id]
	@wb_for_create = params[:wb_for_create]
	case @day_id.to_i
		when 1
			@day = 'Monday'
		when 2
			@day = 'Tuesday'
		when 3
			@day = 'Wednesday'
		when 4
			@day = 'Thursday'
		when 5
			@day = 'Friday'
	end
  end

  # GET /requisitions/1/edit
  def edit
  @room_id = params[:room_id]
	@period_id = params[:period_id]
	@day_id = params[:day_id]
	@class_id = params[:class_id]
	@wb_id = params[:wb_id]
	@week = params[:week]
	case @day_id.to_i
		when 1
			@day = 'Monday'
		when 2
			@day = 'Tuesday'
		when 3
			@day = 'Wednesday'
		when 4
			@day = 'Thursday'
		when 5
			@day = 'Friday'
	end
  end

  # POST /requisitions
  # POST /requisitions.json
  def create
    @wb_id = params[:requisition][:wb_id]
	@week = params[:requisition][:week]
	@requisition = Requisition.new(requisition_params)
	@requisition.user_id = current_user.id
	@requisition.school_id = current_user.school_id
    respond_to do |format|
      if @requisition.save
        format.html { redirect_to add_requisition_requisitions_path(wb_id: @wb_id, week: @week), notice: 'Requisition was successfully created.' }
        format.json { render action: 'show', status: :created, location: @requisition }
      else
        format.html { redirect_to :back, notice: 'Requisition already exists.' }
        format.json { render json: @requisition.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /requisitions/1
  # PATCH/PUT /requisitions/1.json
  def update
  @wb_id = params[:requisition][:wb_id]
  @week = params[:requisition][:week]
    respond_to do |format|
      if @requisition.update(requisition_params)
        format.html { redirect_to add_requisition_requisitions_path(wb_id: @wb_id, week: @week), notice: 'Requisition was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @requisition.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /requisitions/1
  # DELETE /requisitions/1.json
  def destroy
    @requisition.destroy
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_requisition
      @requisition = Requisition.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def requisition_params
      params.require(:requisition).permit(:user_id, :period_id, :day_id, :class_id, :room_id, :wb_id,:content,:school_id)
    end
end
