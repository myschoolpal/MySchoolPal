class AddSchoolToRooms < ActiveRecord::Migration
  def change
  add_column :rooms, :school_id, :integer
  end
end
