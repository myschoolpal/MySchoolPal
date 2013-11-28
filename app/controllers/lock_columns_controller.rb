class LockColumnsController < ApplicationController
  before_action :set_lock_column, only: [:show, :edit, :update, :destroy]

  # GET /lock_columns
  # GET /lock_columns.json
  def index
    @lock_columns = LockColumn.all
	@lock_column_new = LockColumn.new
	@class_names = ClassName.where(school_id: current_user.school_id).all
  end
  
  def show_locked_classes
    @lock_columns = LockColumn.joins(:class_names).where("class_names.school_id" => current_user.school_id).all
  end

  def update_many_locks
  @title = params[:title]
  @col_id = params[:col_id]
	  if @col_id
		  if params['add_classes']
				params['add_classes'].each do |id|
					@lock_column = LockColumn.new(id)	
					@lock_column.title = @title
					@lock_column.col_id = @col_id
					if @lock_column.readonly_title || @lock_column.readonly_result
						@lock_column.save
					end
				end
			end
	  end
	redirect_to :back
  end
  # GET /lock_columns/1
  # GET /lock_columns/1.json
  def show
  end

  # GET /lock_columns/new
  def new
    @lock_column = LockColumn.new
  end

  # GET /lock_columns/1/edit
  def edit
  end

  # POST /lock_columns
  # POST /lock_columns.json
  def create
    @lock_column = LockColumn.new(lock_column_params)

    respond_to do |format|
      if @lock_column.save
        format.html { redirect_to @lock_column, notice: 'Lock column was successfully created.' }
        format.json { render action: 'show', status: :created, location: @lock_column }
      else
        format.html { render action: 'new' }
        format.json { render json: @lock_column.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lock_columns/1
  # PATCH/PUT /lock_columns/1.json
  def update
    respond_to do |format|
      if @lock_column.update(lock_column_params)
        format.html { redirect_to @lock_column, notice: 'Lock column was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @lock_column.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lock_columns/1
  # DELETE /lock_columns/1.json
  def destroy
    @lock_column.destroy
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lock_column
      @lock_column = LockColumn.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def lock_column_params
      params.require(:lock_column).permit(:class_id, :col_id, :title, :readonly_result)
    end
end
