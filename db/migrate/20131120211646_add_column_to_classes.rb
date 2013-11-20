class AddColumnToClasses < ActiveRecord::Migration
  def change
	add_column :class_names, :year_id, :string
  end
end
