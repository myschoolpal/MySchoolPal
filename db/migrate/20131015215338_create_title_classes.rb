class CreateTitleClasses < ActiveRecord::Migration
  def change
    create_table :title_classes do |t|
      t.string :title
      t.integer :class_id
      t.integer :col_id

      t.timestamps
    end
  end
end
