class PupilResult < ActiveRecord::Base
  attr_accessible :user_id, :class_id, :result_id, :col_id
  
  belongs_to :user
  belongs_to :class_name
  belongs_to :result
end
