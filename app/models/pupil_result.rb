class PupilResult < ActiveRecord::Base
  attr_accessible :user_id, :class_id, :result_id, :col_id, :locked
  
  belongs_to :user
  belongs_to :result
  belongs_to :class_name, :foreign_key => "class_id"
  
  validates_uniqueness_of :user_id, :scope => [:col_id, :class_id, :locked]  
end
