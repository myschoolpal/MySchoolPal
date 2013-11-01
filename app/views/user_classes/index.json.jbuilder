json.array!(@user_classes) do |user_class|
  json.extract! user_class, :user_id, :class_id
  json.url user_class_url(user_class, format: :json)
end
