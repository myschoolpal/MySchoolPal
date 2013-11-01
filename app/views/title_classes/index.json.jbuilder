json.array!(@title_classes) do |title_class|
  json.extract! title_class, :title, :class_id, :col_id
  json.url title_class_url(title_class, format: :json)
end
