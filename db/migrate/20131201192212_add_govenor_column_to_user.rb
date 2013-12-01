class AddGovenorColumnToUser < ActiveRecord::Migration
  def change
  add_column :user_infos, :governor, :boolean
  end
end
