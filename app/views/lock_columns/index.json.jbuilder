json.array!(@lock_columns) do |lock_column|
  json.extract! lock_column, :class_id, :col_id, :title, :readonly_result
  json.url lock_column_url(lock_column, format: :json)
end
