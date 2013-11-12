class Timetable < ActiveRecord::Base

  attr_accessible :user_id, :period_id, :day_id, :week_id, :class_id, :room_id
  validates :user_id, presence: true
  validates :period_id, presence: true
  validates :day_id, presence: true
  validates :week_id, presence: true

validates_uniqueness_of :user_id, :scope => [:period_id, :day_id, :week_id]  
	  belongs_to :class_name, :foreign_key => "class_id"
	  belongs_to :room
  
    def self.import(file, current_user)
		number_weeks = current_user.school.number_weeks
		number_periods = current_user.school.number_periods
		CSV.foreach(file.path, headers: true) do |row|
			 
			if u = User.where(school_id: current_user.school_id).where(email: row[0]).first
			@user = u.id
			end
			i=1
			(1..current_user.school.number_weeks).each do |week|
				(1..5).each do |day|
					(1..current_user.school.number_periods).each do |period|
						c=Timetable.new
						if !@user.nil?
						c.user_id = @user
						end
						c.period_id = period
						c.day_id = day
						c.week_id = week			
						if cla = ClassName.where(school_id: current_user.school_id).where(:class_name => row[i]).first
							c.class_id = cla.id
						end
						i+=1
						if r = Room.where(school_id: current_user.school_id).where(room_name: row[i]).first
							c.room_id = r.id
						end
						i+=1
						c.save
					end
				end
			end
		end
	end
end
