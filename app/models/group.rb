class Group < ActiveRecord::Base
  attr_accessible :group, :school_id
  
  has_many :user_groups
  belongs_to :school

validates :group, :uniqueness => {:scope => :school_id}    
end
