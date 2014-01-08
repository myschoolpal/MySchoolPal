class AddColumnsUserInfo < ActiveRecord::Migration
  def change
  add_column :user_infos, :slt, :boolean
  end
end
