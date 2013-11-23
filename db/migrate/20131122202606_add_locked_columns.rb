class AddLockedColumns < ActiveRecord::Migration
  def change
  add_column :pupil_results, :locked , :boolean
  add_column :title_classes, :locked , :boolean
  end
end
