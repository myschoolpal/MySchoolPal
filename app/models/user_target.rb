class UserTarget < ActiveRecord::Base
  attr_accessible :user_id, :subject_id, :target
  
  belongs_to :user
  belongs_to :subject
  belongs_to :result, foreign_key: "target"
  has_one :user_class, :primary_key => "class_id", :foreign_key => "class_id"

  validates :user_id, uniqueness: { scope: :subject_id}
  
  def self.import(file)
  subject_name = Subject.all
  CSV.foreach(file.path, headers: true) do |row|
     i=1
	while i < 40
if !row[i].nil?
	t.user_id = row[0]
	   t.subject_id = subject_name.where(:subject => row[0]).first.id t.subject_id = row[i]
	 i+=1
	 t.target_id = row[i]
	 t.save   
	 end
    end
end
end	 

end
