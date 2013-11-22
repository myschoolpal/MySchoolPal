json.array!(@wb_weeks) do |wb_week|
  json.extract! wb_week, :wb_id, :week_id, :school_id
  json.url wb_week_url(wb_week, format: :json)
end
