json.array!(@class_names) do |class_name|
  json.extract! class_name, :class_name
  json.url class_name_url(class_name, format: :json)
end
