require 'test_helper'

class SubjectClassesControllerTest < ActionController::TestCase
  setup do
    @subject_class = subject_classes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:subject_classes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create subject_class" do
    assert_difference('SubjectClass.count') do
      post :create, subject_class: { class_id: @subject_class.class_id, subject_id: @subject_class.subject_id }
    end

    assert_redirected_to subject_class_path(assigns(:subject_class))
  end

  test "should show subject_class" do
    get :show, id: @subject_class
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @subject_class
    assert_response :success
  end

  test "should update subject_class" do
    patch :update, id: @subject_class, subject_class: { class_id: @subject_class.class_id, subject_id: @subject_class.subject_id }
    assert_redirected_to subject_class_path(assigns(:subject_class))
  end

  test "should destroy subject_class" do
    assert_difference('SubjectClass.count', -1) do
      delete :destroy, id: @subject_class
    end

    assert_redirected_to subject_classes_path
  end
end
