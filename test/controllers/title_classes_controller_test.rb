require 'test_helper'

class TitleClassesControllerTest < ActionController::TestCase
  setup do
    @title_class = title_classes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:title_classes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create title_class" do
    assert_difference('TitleClass.count') do
      post :create, title_class: { class_id: @title_class.class_id, col_id: @title_class.col_id, title: @title_class.title }
    end

    assert_redirected_to title_class_path(assigns(:title_class))
  end

  test "should show title_class" do
    get :show, id: @title_class
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @title_class
    assert_response :success
  end

  test "should update title_class" do
    patch :update, id: @title_class, title_class: { class_id: @title_class.class_id, col_id: @title_class.col_id, title: @title_class.title }
    assert_redirected_to title_class_path(assigns(:title_class))
  end

  test "should destroy title_class" do
    assert_difference('TitleClass.count', -1) do
      delete :destroy, id: @title_class
    end

    assert_redirected_to title_classes_path
  end
end
