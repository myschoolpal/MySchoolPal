require 'test_helper'

class WbWeeksControllerTest < ActionController::TestCase
  setup do
    @wb_week = wb_weeks(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wb_weeks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create wb_week" do
    assert_difference('WbWeek.count') do
      post :create, wb_week: { school_id: @wb_week.school_id, wb_id: @wb_week.wb_id, week_id: @wb_week.week_id }
    end

    assert_redirected_to wb_week_path(assigns(:wb_week))
  end

  test "should show wb_week" do
    get :show, id: @wb_week
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @wb_week
    assert_response :success
  end

  test "should update wb_week" do
    patch :update, id: @wb_week, wb_week: { school_id: @wb_week.school_id, wb_id: @wb_week.wb_id, week_id: @wb_week.week_id }
    assert_redirected_to wb_week_path(assigns(:wb_week))
  end

  test "should destroy wb_week" do
    assert_difference('WbWeek.count', -1) do
      delete :destroy, id: @wb_week
    end

    assert_redirected_to wb_weeks_path
  end
end
