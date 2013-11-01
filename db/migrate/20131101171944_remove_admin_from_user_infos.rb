class RemoveAdminFromUserInfos < ActiveRecord::Migration
  def change
remove_column :user_infos, :admin
  end
end
