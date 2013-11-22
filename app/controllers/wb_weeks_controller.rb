class WbWeeksController < ApplicationController
  before_action :set_wb_week, only: [:show, :edit, :update, :destroy]

  # GET /wb_weeks
  # GET /wb_weeks.json
  def index
    @wb_weeks = WbWeek.all
  end

  # GET /wb_weeks/1
  # GET /wb_weeks/1.json
  def show
  end

  # GET /wb_weeks/new
  def new
    @wb_week = WbWeek.new
  end

  # GET /wb_weeks/1/edit
  def edit
  end

  # POST /wb_weeks
  # POST /wb_weeks.json
  def create
    @wb_week = WbWeek.new(wb_week_params)
	@wb_week.school_id = current_user.school_id
    respond_to do |format|
      if @wb_week.save
        format.html { redirect_to wb_weeks_path, notice: 'Wb week was successfully created.' }
        format.json { render action: 'show', status: :created, location: @wb_week }
      else
        format.html { render action: 'new' }
        format.json { render json: @wb_week.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /wb_weeks/1
  # PATCH/PUT /wb_weeks/1.json
  def update
    respond_to do |format|
      if @wb_week.update(wb_week_params)
        format.html { redirect_to wb_weeks_path, notice: 'Wb week was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @wb_week.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wb_weeks/1
  # DELETE /wb_weeks/1.json
  def destroy
    @wb_week.destroy
    respond_to do |format|
      format.html { redirect_to wb_weeks_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_wb_week
      @wb_week = WbWeek.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def wb_week_params
      params.require(:wb_week).permit(:wb_id, :week_id, :school_id)
    end
end
