class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name
      t.boolean :primary
      t.boolean :secondary

      t.timestamps
    end
  end
end
