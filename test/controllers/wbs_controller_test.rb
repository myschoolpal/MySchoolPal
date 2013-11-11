require 'test_helper'

class WbsControllerTest < ActionController::TestCase
  setup do
    @wb = wbs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wbs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create wb" do
    assert_difference('Wb.count') do
      post :create, wb: { week_beginning: @wb.week_beginning }
    end

    assert_redirected_to wb_path(assigns(:wb))
  end

  test "should show wb" do
    get :show, id: @wb
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @wb
    assert_response :success
  end

  test "should update wb" do
    patch :update, id: @wb, wb: { week_beginning: @wb.week_beginning }
    assert_redirected_to wb_path(assigns(:wb))
  end

  test "should destroy wb" do
    assert_difference('Wb.count', -1) do
      delete :destroy, id: @wb
    end

    assert_redirected_to wbs_path
  end
end
