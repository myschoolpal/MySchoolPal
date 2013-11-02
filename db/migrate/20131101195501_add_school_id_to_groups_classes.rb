class AddSchoolIdToGroupsClasses < ActiveRecord::Migration
  def change
	add_column :class_names, :school_id, :integer
	add_column :groups, :school_id, :integer
	add_column :subjects, :school_id, :integer
  end
end
