class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :timeoutable
         :recoverable, :rememberable, :trackable, :validatable, :timeout_in => 15.minutes
		 
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
		 attr_accessible :email, :password, :school_id, :password_confirmation, :user_info_attributes, :user_classes_attributes, :user_groups_attributes, 
		 :user_targets_attributes, :pupil_results_attributes
		 
		 
		 accepts_nested_attributes_for :user_classes
		 accepts_nested_attributes_for :user_groups
		 accepts_nested_attributes_for :user_targets
		 accepts_nested_attributes_for :pupil_results


		 

		 
end
