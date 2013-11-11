class UpdateLockColumnWithTitle < ActiveRecord::Migration
  def change
	add_column :lock_columns, :readonly_title, :boolean
  end
end
