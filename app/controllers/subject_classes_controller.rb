class SubjectClassesController < ApplicationController
  before_action :set_subject_class, only: [:show, :edit, :update, :destroy]

  # GET /subject_classes
  # GET /subject_classes.json
  def index
    @subject_classes = SubjectClass.all
  end

  def import
  SubjectClass.import(params[:file])
  redirect_to root_url, notice: "Subject for Classes imported."
end

  # GET /subject_classes/1
  # GET /subject_classes/1.json
  def show
  end

  # GET /subject_classes/new
  def new
    @subject_class = SubjectClass.new
  end

  # GET /subject_classes/1/edit
  def edit
  end

  # POST /subject_classes
  # POST /subject_classes.json
  def create
    @subject_class = SubjectClass.new(subject_class_params)

    respond_to do |format|
      if @subject_class.save
        format.html { redirect_to @subject_class, notice: 'Subject class was successfully created.' }
        format.json { render action: 'show', status: :created, location: @subject_class }
      else
        format.html { render action: 'new' }
        format.json { render json: @subject_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /subject_classes/1
  # PATCH/PUT /subject_classes/1.json
  def update
    respond_to do |format|
      if @subject_class.update(subject_class_params)
        format.html { redirect_to @subject_class, notice: 'Subject class was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @subject_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /subject_classes/1
  # DELETE /subject_classes/1.json
  def destroy
    @subject_class.destroy
    respond_to do |format|
      format.html { redirect_to subject_classes_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_subject_class
      @subject_class = SubjectClass.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def subject_class_params
      params.require(:subject_class).permit(:subject_id, :class_id)
    end
end
