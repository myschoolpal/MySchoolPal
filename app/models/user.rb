class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :timeoutable,
         :recoverable, :rememberable, :trackable, :validatable, :authentication_keys => [:login], :timeout_in => 15.minutes
		 
		 # Virtual attribute for authenticating by either username or email
		# This is in addition to a real persisted field like 'username'
		attr_accessor :login
		 
		 has_one :user_info, dependent: :destroy
		 belongs_to :school
		 accepts_nested_attributes_for :user_info
		 has_many :user_classes, dependent: :destroy
		 has_many :class_names, through: :user_classes
		 has_many :subject_classes, through: :user_classes
		 has_many :user_targets, dependent: :destroy
		 has_many :results, through: :user_targets
		 has_many :user_groups, dependent: :destroy
		 has_many :groups, through: :user_groups
		 has_many :pupil_results, dependent: :destroy
		 has_many :requisitions
		 has_many :timetables
		 attr_accessible :username, :login, :email, :password, :school_id, :password_confirmation, :user_info_attributes, :user_classes_attributes, :user_groups_attributes, 
		 :user_targets_attributes, :pupil_results_attributes
		 
		 validates :username, :uniqueness => {:case_sensitive => false }
		 def email_required?
			false
		end

		def email_changed?
		  false
		end
		 accepts_nested_attributes_for :user_classes
		 accepts_nested_attributes_for :user_groups
		 accepts_nested_attributes_for :user_targets
		 accepts_nested_attributes_for :pupil_results

		  def self.find_first_by_auth_conditions(warden_conditions)
			  conditions = warden_conditions.dup
			  if login = conditions.delete(:login)
				where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
			  else
				where(conditions).first
			  end
			end

		 

		 
end
