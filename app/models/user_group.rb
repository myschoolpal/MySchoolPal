class UserGroup < ActiveRecord::Base
  attr_accessible :group_id, :user_id
  
  belongs_to :user
  belongs_to :group
  has_many :user_classes, :primary_key => "user_id", foreign_key: 'user_id'

validates :user_id, uniqueness: { scope: :group_id}  
  
  def self.import(file, current_user)
	group_name = Group.where(school_id: current_user.school_id).all
  CSV.foreach(file.path, headers: true) do |row|
     for i in 1..20
	 if !row[i].nil?
	 g = UserGroup.new
     g.user_id = row[0]
	 g.group_id = group_name.where(:group => row[i]).first.id
	 g.save 
end	 
    end
	 end
	 end
end
