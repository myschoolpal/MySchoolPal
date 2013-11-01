class CreateUserTargets < ActiveRecord::Migration
  def change
    create_table :user_targets do |t|
      t.integer :user_id
      t.integer :subject_id
      t.string :target

      t.timestamps
    end
  end
end
