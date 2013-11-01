require 'test_helper'

class ClassNamesControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end

  def test_show
    get :show, :id => ClassNames.first
    assert_template 'show'
  end

  def test_new
    get :new
    assert_template 'new'
  end

  def test_create_invalid
    ClassNames.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end

  def test_create_valid
    ClassNames.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to class_names_url(assigns(:class_names))
  end

  def test_edit
    get :edit, :id => ClassNames.first
    assert_template 'edit'
  end

  def test_update_invalid
    ClassNames.any_instance.stubs(:valid?).returns(false)
    put :update, :id => ClassNames.first
    assert_template 'edit'
  end

  def test_update_valid
    ClassNames.any_instance.stubs(:valid?).returns(true)
    put :update, :id => ClassNames.first
    assert_redirected_to class_names_url(assigns(:class_names))
  end

  def test_destroy
    class_names = ClassNames.first
    delete :destroy, :id => class_names
    assert_redirected_to class_names_url
    assert !ClassNames.exists?(class_names.id)
  end
end
