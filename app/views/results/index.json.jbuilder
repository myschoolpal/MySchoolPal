json.array!(@results) do |result|
  json.extract! result, :grade, :aps
  json.url result_url(result, format: :json)
end
