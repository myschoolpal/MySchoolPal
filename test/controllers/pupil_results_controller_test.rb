require 'test_helper'

class PupilResultsControllerTest < ActionController::TestCase
  setup do
    @pupil_result = pupil_results(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:pupil_results)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create pupil_result" do
    assert_difference('PupilResult.count') do
      post :create, pupil_result: { class_id: @pupil_result.class_id, col_id: @pupil_result.col_id, result: @pupil_result.result, user_id: @pupil_result.user_id }
    end

    assert_redirected_to pupil_result_path(assigns(:pupil_result))
  end

  test "should show pupil_result" do
    get :show, id: @pupil_result
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @pupil_result
    assert_response :success
  end

  test "should update pupil_result" do
    patch :update, id: @pupil_result, pupil_result: { class_id: @pupil_result.class_id, col_id: @pupil_result.col_id, result: @pupil_result.result, user_id: @pupil_result.user_id }
    assert_redirected_to pupil_result_path(assigns(:pupil_result))
  end

  test "should destroy pupil_result" do
    assert_difference('PupilResult.count', -1) do
      delete :destroy, id: @pupil_result
    end

    assert_redirected_to pupil_results_path
  end
end
