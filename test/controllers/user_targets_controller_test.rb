require 'test_helper'

class UserTargetsControllerTest < ActionController::TestCase
  setup do
    @user_target = user_targets(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_targets)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_target" do
    assert_difference('UserTarget.count') do
      post :create, user_target: { subject_id: @user_target.subject_id, target: @user_target.target, user_id: @user_target.user_id }
    end

    assert_redirected_to user_target_path(assigns(:user_target))
  end

  test "should show user_target" do
    get :show, id: @user_target
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_target
    assert_response :success
  end

  test "should update user_target" do
    patch :update, id: @user_target, user_target: { subject_id: @user_target.subject_id, target: @user_target.target, user_id: @user_target.user_id }
    assert_redirected_to user_target_path(assigns(:user_target))
  end

  test "should destroy user_target" do
    assert_difference('UserTarget.count', -1) do
      delete :destroy, id: @user_target
    end

    assert_redirected_to user_targets_path
  end
end
