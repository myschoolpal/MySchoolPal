class CreateLockColumns < ActiveRecord::Migration
  def change
    create_table :lock_columns do |t|
      t.integer :class_id
      t.integer :col_id
      t.string :title
      t.boolean :readonly_result

      t.timestamps
    end
  end
end
