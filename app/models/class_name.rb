class ClassName < ActiveRecord::Base
  attr_accessible :class_name
  
  has_many :subject_classes
  has_many :user_classes
  has_many :title_classes
  has_many :pupil_results

  
  def self.import(file)
  CSV.foreach(file.path, headers: true) do |row|
     c = ClassName.new
     c.class_name = row[0]
	 c.save   
	 
  end
  end
  end
