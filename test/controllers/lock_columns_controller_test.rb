require 'test_helper'

class LockColumnsControllerTest < ActionController::TestCase
  setup do
    @lock_column = lock_columns(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:lock_columns)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create lock_column" do
    assert_difference('LockColumn.count') do
      post :create, lock_column: { class_id: @lock_column.class_id, col_id: @lock_column.col_id, readonly_result: @lock_column.readonly_result, title: @lock_column.title }
    end

    assert_redirected_to lock_column_path(assigns(:lock_column))
  end

  test "should show lock_column" do
    get :show, id: @lock_column
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @lock_column
    assert_response :success
  end

  test "should update lock_column" do
    patch :update, id: @lock_column, lock_column: { class_id: @lock_column.class_id, col_id: @lock_column.col_id, readonly_result: @lock_column.readonly_result, title: @lock_column.title }
    assert_redirected_to lock_column_path(assigns(:lock_column))
  end

  test "should destroy lock_column" do
    assert_difference('LockColumn.count', -1) do
      delete :destroy, id: @lock_column
    end

    assert_redirected_to lock_columns_path
  end
end
