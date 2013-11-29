class ClassName < ActiveRecord::Base
  attr_accessible :class_name, :school_id, :subject_id, :year_id
  
  has_many :lock_columns
  has_many :subject_classes
  belongs_to :subject
  has_many :user_classes
  has_many :title_classes, :foreign_key => "class_id"
  has_many :pupil_results
  has_many :timetables
  has_many :requisitions
  belongs_to :school

  validates :class_name, :uniqueness => {:scope => :school_id}  
  
  def self.import(file, current_user)
  CSV.foreach(file.path, headers: true) do |row|
     c = ClassName.new
     c.class_name = row[0]
	 if Subject.where(subject:row[1]).first
	 c.subject_id = Subject.where(subject:row[1]).first.id
	 end
	 c.year_id = row[2]
	 c.school_id = current_user.school_id
	 c.save   
	 
  end
  end
  end
