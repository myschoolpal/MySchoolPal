class AddColumnToUserInfo < ActiveRecord::Migration
  def change
add_column :user_infos, :gender, :string
  end
end
