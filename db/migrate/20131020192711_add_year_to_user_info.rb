class AddYearToUserInfo < ActiveRecord::Migration
  def change
 add_column :user_infos, :year, :string
  end
end
