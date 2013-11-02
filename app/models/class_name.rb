class ClassName < ActiveRecord::Base
  attr_accessible :class_name, :school_id
  
  has_many :subject_classes
  has_many :user_classes
  has_many :title_classes
  has_many :pupil_results
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
