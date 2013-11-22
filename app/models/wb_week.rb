class WbWeek < ActiveRecord::Base

attr_accessible :school_id, :wb_id, :week_id

belongs_to :school
belongs_to :wb

validates :school_id, uniqueness: { scope: :wb_id}  

end
