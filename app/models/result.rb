class Result < ActiveRecord::Base
  attr_accessible :grade, :aps
  
  has_many :user_targets
  has_many :pupil_results
end
