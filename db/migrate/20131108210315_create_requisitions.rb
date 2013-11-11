class CreateRequisitions < ActiveRecord::Migration
  def change
    create_table :requisitions do |t|
      t.integer :user_id
      t.integer :period_id
      t.integer :day_id
      t.integer :class_id
      t.integer :room_id
      t.integer :wb_id

      t.timestamps
    end
  end
end
