class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.string :group

      t.timestamps
    end
  end
end
