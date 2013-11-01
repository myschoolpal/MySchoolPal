json.array!(@user_targets) do |user_target|
  json.extract! user_target, :user_id, :subject_id, :target
  json.url user_target_url(user_target, format: :json)
end
