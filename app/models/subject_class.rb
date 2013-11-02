class SubjectClass < ActiveRecord::Base
  attr_accessible :subject_id, :class_id
  
  belongs_to :subject
  belongs_to :class_name, :foreign_key => "class_id"

validates :subject_id, :uniqueness => {:scope => :class_id}    
  
  def self.import(file)
  classname = ClassName.all
  subject_name = Subject.all
  CSV.foreach(file.path, headers: true) do |row|
     for i in 1..100
	 if !row[i].nil?
	 c = SubjectClass.new
     c.subject_id = subject_name.where(:subject => row[0]).first.id
	 c.class_id = classname.where(:class_name => row[i]).first.id
	 c.save   
	 end
    end
	 end
	 end
end
