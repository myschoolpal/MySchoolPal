class Result < ActiveRecord::Base
  attr_accessible :grade, :aps
  
  has_many :user_targets
  has_many :pupil_results
  
  
  
    def self.import(file)
  CSV.foreach(file.path, headers: true) do |row|
     r = Result.new
     r.grade= row[0]
	 r.aps =  row[1]
	 r.save   
	 
  end
  end

end
