class AddColumnsToSchool < ActiveRecord::Migration
  def change
add_column :schools, :number_weeks, :integer
add_column :schools, :number_periods, :integer
  end
end
