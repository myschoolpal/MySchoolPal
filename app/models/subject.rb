class Subject < ActiveRecord::Base
  attr_accessible :subject
  
  has_many :subject_classes
  has_many :user_targets

  
end
