class CreateTimetables < ActiveRecord::Migration
  def change
    create_table :timetables do |t|
      t.integer :user_id
      t.integer :period_id
      t.integer :day_id
      t.integer :week_id
      t.integer :class_id
      t.integer :room_id

      t.timestamps
    end
  end
end
