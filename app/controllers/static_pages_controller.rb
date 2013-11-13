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
end
