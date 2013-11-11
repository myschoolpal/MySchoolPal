class AddSchoolIdToReq < ActiveRecord::Migration
  def change
  add_column :requisitions, :school_id, :integer
  end
end
