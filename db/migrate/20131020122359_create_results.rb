class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.string :grade
      t.integer :aps

      t.timestamps
    end
  end
end
