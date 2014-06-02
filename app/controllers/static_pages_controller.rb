class StaticPagesController < ApplicationController
  def home
	@home = true
  end

  def about
	@about = true
  end

  def contact
	@contact = true
  end

  def features
	@features = true
  end
  
  def tandc
	@tandc = true  
  end
  
  def privacy
	@privacy = true
  end
  
  def transition_matrix
	
	
  end
  
  def window
	@window = true
  end
  
end
