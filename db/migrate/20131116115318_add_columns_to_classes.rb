class AddColumnsToClasses < ActiveRecord::Migration
  def change
  add_column :class_names, :subject_id, :integer
  end
end
