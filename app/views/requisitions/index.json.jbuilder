json.array!(@requisitions) do |requisition|
  json.extract! requisition, :user_id, :period_id, :day_id, :class_id, :room_id, :wb_id
  json.url requisition_url(requisition, format: :json)
end
