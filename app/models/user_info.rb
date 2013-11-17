class UserInfo < ActiveRecord::Base
  attr_accessible :forename, :surname, :user_id, :ks2_english, :ks2_maths, :ks1_english, :ks1_maths, :ks1_reading, :ks1_writing, :pupil, :teacher, :year,
  :admin, :gender, :user_classes_attributes, :user_groups_attributes, :user_targets_attributes, :pupil_results_attributes
  
  belongs_to :user
  has_many :user_groups, through: :user
  has_many :groups, through: :user_groups
  has_many :user_classes, through: :user
  has_many :class_names, through: :user_classes
  has_many :user_targets, through: :user
  has_many :subjects, through: :user_targets
  accepts_nested_attributes_for :user_classes
  accepts_nested_attributes_for :user_groups
  accepts_nested_attributes_for :user_targets
  validates :user_id, uniqueness: true
  
  
def self.import(file, current_user)
 
  CSV.foreach(file.path, headers: true) do |row|
		
	 if User.where(email: row[0].downcase).first
	user = User.where(email: row[0].downcase).first.id
	 else
		u = User.new
		u.school_id = current_user.school_id
		u.email = row[0]
		u.password = row[1]
		u.save   
		user=u.id
		
	end
	check_user = UserInfo.where(:user_id =>user).first
		if check_user
		check_user.forename = row[2]
		check_user.surname = row[3]
		check_user.teacher = row[4]
		check_user.pupil = row[5]
		check_user.year = row[6]
		check_user.gender = row[7]		
		if !Result.where(:grade => [row[8]]).first.nil?
				check_user.ks2_english = Result.where(:grade => [row[8]]).first.id
			end
			if  !Result.where(:grade => [row[9]]).first.nil?
				check_user.ks2_maths = Result.where(:grade => [row[9]]).first.id
			end
			if !Result.where(:grade => [row[10]]).first.nil?
				check_user.ks2_science = Result.where(:grade => [row[10]]).first.id
			end
			if !Result.where(:grade => [row[11]]).first.nil?
				check_user.ks1_english = Result.where(:grade => [row[11]]).first.id
			end
			if !Result.where(:grade => [row[12]]).first.nil?
				check_user.ks1_maths = Result.where(:grade => [row[12]]).first.id
			end
			if !Result.where(:grade => [row[13]]).first.nil?
				check_user.ks1_reading = Result.where(:grade => [row[13]]).first.id
			end
			if !Result.where(:grade => [row[14]]).first.nil?
				check_user.ks1_writing = Result.where(:grade => [row[14]]).first.id
			end
		
		check_user.save!
		
		for i in 15..34
				if !row[i].nil?
					if ClassName.where(school_id: current_user.school_id).where(:class_name => row[i]).first
						c = UserClass.new
						c.user_id = user
						c.class_id = ClassName.where(school_id: current_user.school_id).where(:class_name => row[i]).first.id
						c.save   
					end
				end
			end
		
		for i in 35..54
				if !row[i].nil?
					if Group.where(:group => row[i]).first
						g = UserGroup.new
						g.user_id = user
						g.group_id = Group.where(:group => row[i]).first.id
						g.save 
					end
				end	 
			end
	
			i=55
			while i < 95
				if !row[i].nil?
					if Subject.where(:subject => row[i]).first
						t = UserTarget.new
						t.user_id = user
						if s = Subject.where(:subject => row[i]).first 
							t.subject_id = s.id 
							j=i+1
							if r = Result.where(:grade => [row[i+1]]).first
								t.target = r.id
								t.save   
							end
						end
					end
				end
			i+=1
			end
		
		
		
		elsif user.nil?
		 
		
		else
		ui = UserInfo.new
		ui.user_id = user
		ui.forename = row[2]
		ui.surname = row[3]
		ui.teacher = row[4]
		ui.pupil = row[5]
		ui.year = row[6]
	 	ui.gender = row[7]
	 
			if !Result.where(:grade => [row[8]]).first.nil?
				ui.ks2_english = Result.where(:grade => [row[8]]).first.id
			end
			if  !Result.where(:grade => [row[9]]).first.nil?
				ui.ks2_maths = Result.where(:grade => [row[9]]).first.id
			end
			if !Result.where(:grade => [row[10]]).first.nil?
				ui.ks2_science = Result.where(:grade => [row[10]]).first.id
			end
			if !Result.where(:grade => [row[11]]).first.nil?
				ui.ks1_english = Result.where(:grade => [row[11]]).first.id
			end
			if !Result.where(:grade => [row[12]]).first.nil?
				ui.ks1_maths = Result.where(:grade => [row[12]]).first.id
			end
			if !Result.where(:grade => [row[13]]).first.nil?
				ui.ks1_reading = Result.where(:grade => [row[13]]).first.id
			end
			if !Result.where(:grade => [row[14]]).first.nil?
				ui.ks1_writing = Result.where(:grade => [row[14]]).first.id
			end
			ui.save
	 
			for i in 15..34
				if !row[i].nil?
					if ClassName.where(school_id: current_user.school_id).where(:class_name => row[i]).first
						c = UserClass.new
						c.user_id = user
						c.class_id = ClassName.where(school_id: current_user.school_id).where(:class_name => row[i]).first.id
						c.save   
					end
				end
			end
	 
			for i in 35..44
				if !row[i].nil?
					if Group.where(:group => row[i]).first
						g = UserGroup.new
						g.user_id = user
						g.group_id = Group.where(:group => row[i]).first.id
						g.save 
					end
				end	 
			end
	
			i=45
			while i < 85
			if !row[i].nil?
					if Subject.where(:subject => row[i]).first
						t = UserTarget.new
						t.user_id = user
						if s = Subject.where(:subject => row[i]).first 
							t.subject_id = s.id 
							j=i+1
							if r = Result.where(:grade => [row[i+1]]).first
								t.target = r.id
								t.save   
							end
						end
					end
				end
			i+=1
			end
		end
    end

end
end
