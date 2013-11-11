class Requisition < ActiveRecord::Base
attr_accessible :user_id, :period_id, :day_id, :class_id, :room_id, :wb_id, :school_id, :content

belongs_to :room
belongs_to :user
belongs_to :class_name, foreign_key: "class_id"
  validates :content, presence: true
validates_uniqueness_of :user_id, :scope => [:period_id, :day_id, :wb_id]  
end
