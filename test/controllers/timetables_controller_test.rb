require 'test_helper'

class TimetablesControllerTest < ActionController::TestCase
  setup do
    @timetable = timetables(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:timetables)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create timetable" do
    assert_difference('Timetable.count') do
      post :create, timetable: { class_id: @timetable.class_id, day_id: @timetable.day_id, period_id: @timetable.period_id, room_id: @timetable.room_id, user_id: @timetable.user_id, week_id: @timetable.week_id }
    end

    assert_redirected_to timetable_path(assigns(:timetable))
  end

  test "should show timetable" do
    get :show, id: @timetable
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @timetable
    assert_response :success
  end

  test "should update timetable" do
    patch :update, id: @timetable, timetable: { class_id: @timetable.class_id, day_id: @timetable.day_id, period_id: @timetable.period_id, room_id: @timetable.room_id, user_id: @timetable.user_id, week_id: @timetable.week_id }
    assert_redirected_to timetable_path(assigns(:timetable))
  end

  test "should destroy timetable" do
    assert_difference('Timetable.count', -1) do
      delete :destroy, id: @timetable
    end

    assert_redirected_to timetables_path
  end
end
