class Room < ActiveRecord::Base

attr_accessible :room_name, :school_id

has_many :timetables
has_many :requisitions

def self.import(file, current_user)
 
  CSV.foreach(file.path, headers: true) do |row|
     
	 r = Room.new
     r.school_id = current_user.school_id
	 r.room_name = row[0]
	 r.save   
	 
	 end
	 end
	
end
