json.array!(@pupil_results) do |pupil_result|
  json.extract! pupil_result, :user_id, :class_id, :result, :col_id
  json.url pupil_result_url(pupil_result, format: :json)
end
