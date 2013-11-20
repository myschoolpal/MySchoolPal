class ClassName < ActiveRecord::Base
  attr_accessible :class_name, :school_id, :subject_id, :year_id
  
  has_many :lock_columns
  has_many :subject_classes
  belongs_to :subject
  has_many :user_classes
  has_many :title_classes
  has_many :pupil_results
  has_many :timetables
  has_many :requisitions
  belongs_to :school

  validates :class_name, :uniqueness => {:scope => :school_id}  
  
  def self.import(file, current_user)
  CSV.foreach(file.path, headers: true) do |row|
     c = ClassName.new
     c.class_name = row[0]
	 c.school_id = current_user.school_id
	 c.save   
	 
  end
  end
  end
