class ChangePupilTeacherToBoolean < ActiveRecord::Migration
  def change
	remove_column :user_infos, :pupil
	remove_column :user_infos, :teacher
	add_column :user_infos, :pupil, :boolean
	add_column :user_infos, :teacher, :boolean
  end
end
