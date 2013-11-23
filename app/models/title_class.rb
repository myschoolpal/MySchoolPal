class TitleClass < ActiveRecord::Base
  attr_accessible :title, :class_id, :col_id, :locked
  
  belongs_to :class_name, :foreign_key => "class_id"
  
  validates :class_id, :uniqueness => {:scope => [:col_id, :locked]}  
end
