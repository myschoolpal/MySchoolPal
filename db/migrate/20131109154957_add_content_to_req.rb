class AddContentToReq < ActiveRecord::Migration
  def change
  add_column :requisitions, :content, :text
  end
end
