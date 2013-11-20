class SubjectClass < ActiveRecord::Base
  attr_accessible :subject_id, :class_id
  
  belongs_to :subject
  belongs_to :class_name, :foreign_key => "class_id"
  has_one :user_class, :primary_key => "class_id", :foreign_key => "class_id"

validates :subject_id, :uniqueness => {:scope => :class_id}    
  
  def self.import(file, current_user)
  classname = ClassName.where(school_id: current_user.school_id).all
  subject_name = Subject.all
  CSV.foreach(file.path, headers: true) do |row|
     
	 c = SubjectClass.new
     c.class_id = classname.where(:class_name => row[0].to_s).first.id
	 c.subject_id = subject_name.where(:subject => row[1].to_s).first.id
	 c.save   
	 
	 end
	 end
end
