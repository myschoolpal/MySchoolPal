json.array!(@subject_classes) do |subject_class|
  json.extract! subject_class, :subject_id, :class_id
  json.url subject_class_url(subject_class, format: :json)
end
