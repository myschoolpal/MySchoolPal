class CreatePupilResults < ActiveRecord::Migration
  def change
    create_table :pupil_results do |t|
      t.integer :user_id
      t.integer :class_id
      t.string :result
      t.integer :col_id

      t.timestamps
    end
  end
end
