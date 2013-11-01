require 'test_helper'

class ClassNamesControllerTest < ActionController::TestCase
  setup do
    @class_name = class_names(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:class_names)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create class_name" do
    assert_difference('ClassName.count') do
      post :create, class_name: { class_name: @class_name.class_name }
    end

    assert_redirected_to class_name_path(assigns(:class_name))
  end

  test "should show class_name" do
    get :show, id: @class_name
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @class_name
    assert_response :success
  end

  test "should update class_name" do
    patch :update, id: @class_name, class_name: { class_name: @class_name.class_name }
    assert_redirected_to class_name_path(assigns(:class_name))
  end

  test "should destroy class_name" do
    assert_difference('ClassName.count', -1) do
      delete :destroy, id: @class_name
    end

    assert_redirected_to class_names_path
  end
end
