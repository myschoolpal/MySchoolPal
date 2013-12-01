class TitleClassesController < ApplicationController
  before_action :set_title_class, only: [:show, :edit, :update, :destroy]

  # GET /title_classes
  # GET /title_classes.json
  def index
    @title_classes = TitleClass.all
	if params[:locked] == "false"
		@locked = false
	else
		@locked = true
	end
  end

  # GET /title_classes/1
  # GET /title_classes/1.json
  def show
  end

  # GET /title_classes/new
  def new
    @title_class = TitleClass.new
		@years = ClassName.where(school_id: current_user.school_id).order("year_id ASC").uniq.pluck(:year_id)
		@class_names = ClassName.where(school_id: current_user.school_id).order("year_id ASC")
		@subjects = ClassName.where(school_id: current_user.school_id).uniq.pluck(:subject_id)
  end
  
  def delete_multiple_titles
	if params[:delete_titles]
	TitleClass.destroy(params[:delete_titles])
	end
  redirect_to :back
  end
  
  def update_lock_columns
  if params['add_titles']
	params['add_titles'].each do |title|
		@title = title[:title]
		@col_id = title[:col_id]
		if !@title.empty?
			if params['add_classes']
				params['add_classes'].each do |id|
					@lock_column = TitleClass.new(id)	
					@lock_column.title = @title
					@lock_column.col_id = @col_id
					if @lock_column.locked
						@lock_column.save
					end
				end
			end
		end
	end
  end
redirect_to :back  
  
  end

  # GET /title_classes/1/edit
  def edit
  	@class_names = ClassName.all
  end

  # POST /title_classes
  # POST /title_classes.json
  def create
    @title_class = TitleClass.new(title_class_params)

    respond_to do |format|
      if @title_class.save
        format.html { redirect_to @title_class, notice: 'Title class was successfully created.' }
        format.json { render action: 'show', status: :created, location: @title_class }
      else
        format.html { render action: 'new' }
        format.json { render json: @title_class.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def lock_columns
	@title_class = TitleClass.new
  end

  # PATCH/PUT /title_classes/1
  # PATCH/PUT /title_classes/1.json
  def update
    respond_to do |format|
      if @title_class.update(title_class_params)
        format.html { redirect_to @title_class, notice: 'Title class was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @title_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /title_classes/1
  # DELETE /title_classes/1.json
  def destroy
    @title_class.destroy
    respond_to do |format|
      format.html { redirect_to title_classes_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_title_class
      @title_class = TitleClass.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def title_class_params
      params.require(:title_class).permit(:title, :class_id, :col_id, :locked)
    end
end
