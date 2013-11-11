json.array!(@timetables) do |timetable|
  json.extract! timetable, :user_id, :period_id, :day_id, :week_id, :class_id, :room_id
  json.url timetable_url(timetable, format: :json)
end
