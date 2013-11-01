require 'test_helper'

class ClassNamesTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert ClassNames.new.valid?
  end
end
