class LockColumn < ActiveRecord::Base
attr_accessible :class_id, :col_id, :readonly_result, :readonly_title, :title, :locked

belongs_to :class_name, :foreign_key => 'class_id'

validates_uniqueness_of :class_id, :scope => [:col_id, :locked]  

end
