json.array!(@wbs) do |wb|
  json.extract! wb, :week_beginning
  json.url wb_url(wb, format: :json)
end
