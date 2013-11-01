class CreateClassNames < ActiveRecord::Migration
  def change
    create_table :class_names do |t|
      t.string :class_name

      t.timestamps
    end
  end
end
