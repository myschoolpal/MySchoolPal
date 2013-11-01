class CreateUserInfos < ActiveRecord::Migration
  def self.up
    create_table :user_infos do |t|
      t.string :forename
      t.string :surname
      t.integer :user_id
      t.integer :ks2_english
      t.integer :ks2_maths
      t.timestamps
    end
  end

  def self.down
    drop_table :user_infos
  end
end
