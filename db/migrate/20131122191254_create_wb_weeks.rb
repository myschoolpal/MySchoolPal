class CreateWbWeeks < ActiveRecord::Migration
  def change
    create_table :wb_weeks do |t|
      t.integer :wb_id
      t.integer :week_id
      t.integer :school_id

      t.timestamps
    end
  end
end
