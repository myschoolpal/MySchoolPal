class AddToUserInfo < ActiveRecord::Migration
  def change
  add_column :user_infos, :ks2_science, :string
  add_column :user_infos, :ks1_english, :string
  add_column :user_infos, :ks1_maths, :string
  add_column :user_infos, :ks1_reading, :string
  add_column :user_infos, :ks1_writing, :string
  add_column :user_infos, :pupil, :string
  add_column :user_infos, :teacher, :string
  add_column :user_infos, :admin, :string
  end
end
