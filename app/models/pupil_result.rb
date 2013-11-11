class PupilResult < ActiveRecord::Base
  attr_accessible :user_id, :class_id, :result_id, :col_id
  
  belongs_to :user
  belongs_to :class_name
  belongs_to :result
  has_many :user_classes, :primary_key => "class_id", :foreign_key => "class_id"
  
  validates_uniqueness_of :user_id, :scope => [:col_id, :class_id]  
end
