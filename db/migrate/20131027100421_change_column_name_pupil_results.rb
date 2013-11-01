class ChangeColumnNamePupilResults < ActiveRecord::Migration
  def change
rename_column :pupil_results, :result, :result_id
  end
end
