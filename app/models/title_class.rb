class TitleClass < ActiveRecord::Base
  attr_accessible :title, :class_id, :col_id
  
  belongs_to :class_names
end
