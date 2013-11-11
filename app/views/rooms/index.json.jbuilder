json.array!(@rooms) do |room|
  json.extract! room, :room_name
  json.url room_url(room, format: :json)
end
