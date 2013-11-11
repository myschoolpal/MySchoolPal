class CreateWbs < ActiveRecord::Migration
  def change
    create_table :wbs do |t|
      t.date :week_beginning

      t.timestamps
    end
  end
end
