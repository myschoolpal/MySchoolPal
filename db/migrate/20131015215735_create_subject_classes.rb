class CreateSubjectClasses < ActiveRecord::Migration
  def change
    create_table :subject_classes do |t|
      t.integer :subject_id
      t.integer :class_id

      t.timestamps
    end
  end
end
