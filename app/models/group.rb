class Group < ActiveRecord::Base
  attr_accessible :group
  
  has_many :user_groups

  
end
