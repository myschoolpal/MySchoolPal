class AddDashboardToSchools < ActiveRecord::Migration
  def change
  add_column :schools, :dashboard, :boolean
  end
end
