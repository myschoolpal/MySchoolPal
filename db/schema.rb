# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140108223219) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "class_names", force: true do |t|
    t.string   "class_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "school_id"
    t.integer  "subject_id"
    t.string   "year_id"
  end

  create_table "groups", force: true do |t|
    t.string   "group"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "school_id"
  end

  create_table "lock_columns", force: true do |t|
    t.integer  "class_id"
    t.integer  "col_id"
    t.string   "title"
    t.boolean  "readonly_result"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "readonly_title"
  end

  create_table "pupil_results", force: true do |t|
    t.integer  "user_id"
    t.integer  "class_id"
    t.string   "result_id"
    t.integer  "col_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "locked"
  end

  create_table "requisitions", force: true do |t|
    t.integer  "user_id"
    t.integer  "period_id"
    t.integer  "day_id"
    t.integer  "class_id"
    t.integer  "room_id"
    t.integer  "wb_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "school_id"
    t.text     "content"
  end

  create_table "results", force: true do |t|
    t.string   "grade"
    t.integer  "aps"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rooms", force: true do |t|
    t.string   "room_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "school_id"
  end

  create_table "school_days", force: true do |t|
    t.integer  "school_id"
    t.integer  "week_id"
    t.integer  "period_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "schools", force: true do |t|
    t.string   "name"
    t.boolean  "primary"
    t.boolean  "secondary"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "number_weeks"
    t.integer  "number_periods"
  end

  create_table "subject_classes", force: true do |t|
    t.integer  "subject_id"
    t.integer  "class_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "subjects", force: true do |t|
    t.string   "subject"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "school_id"
  end

  create_table "timetables", force: true do |t|
    t.integer  "user_id"
    t.integer  "period_id"
    t.integer  "day_id"
    t.integer  "week_id"
    t.integer  "class_id"
    t.integer  "room_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "title_classes", force: true do |t|
    t.string   "title"
    t.integer  "class_id"
    t.integer  "col_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "locked"
  end

  create_table "user_classes", force: true do |t|
    t.integer  "user_id"
    t.integer  "class_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_groups", force: true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_infos", force: true do |t|
    t.string   "forename"
    t.string   "surname"
    t.integer  "user_id"
    t.integer  "ks2_english"
    t.integer  "ks2_maths"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "ks2_science"
    t.string   "ks1_english"
    t.string   "ks1_maths"
    t.string   "ks1_reading"
    t.string   "ks1_writing"
    t.string   "year"
    t.string   "gender"
    t.boolean  "pupil"
    t.boolean  "teacher"
    t.boolean  "governor"
    t.boolean  "slt"
  end

  create_table "user_targets", force: true do |t|
    t.integer  "user_id"
    t.integer  "subject_id"
    t.string   "target"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",                  default: false
    t.integer  "school_id"
    t.string   "username"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "wb_weeks", force: true do |t|
    t.integer  "wb_id"
    t.integer  "week_id"
    t.integer  "school_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wbs", force: true do |t|
    t.date     "week_beginning"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
