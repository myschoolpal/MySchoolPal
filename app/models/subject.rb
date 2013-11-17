class Subject < ActiveRecord::Base
  attr_accessible :subject, :school_id
  
  has_many :subject_classes
  has_many :user_targets
  has_many :class_names
  belongs_to :school
  
  validates :subject, :uniqueness => {:scope => :school_id}  
end
