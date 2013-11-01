class UserClass < ActiveRecord::Base
  attr_accessible :user_id, :class_id
  
  belongs_to :user
  belongs_to :class_name, :foreign_key => "class_id"

validates :user_id, uniqueness: { scope: :class_id}
  
  def self.import(file)
  classname = ClassName.all
  CSV.foreach(file.path, headers: true) do |row|
     for i in 1..20
	 if !row[i].nil?
	 c = UserClass.new
     c.user_id = row[0]
	 c.class_id = classname.where(:class_name => row[i]).first.id
	 c.save   
	 end
	 
    end
	 
	 
  end
end
end
