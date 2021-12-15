# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_15_090547) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "blockchains", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "identifier", default: 0, null: false
    t.index ["identifier"], name: "index_blockchains_on_identifier", unique: true
  end

  create_table "cryptocurrencies", force: :cascade do |t|
    t.integer "decimals", null: false
    t.string "name", null: false
    t.string "symbol", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "price", precision: 15, scale: 10
    t.bigint "smart_contract_id"
    t.boolean "official"
    t.bigint "blockchain_id"
    t.string "denom"
    t.index ["blockchain_id"], name: "index_cryptocurrencies_on_blockchain_id"
    t.index ["smart_contract_id", "symbol"], name: "index_cryptocurrencies_on_smart_contract_id_and_symbol", unique: true
    t.index ["smart_contract_id"], name: "index_cryptocurrencies_on_smart_contract_id", unique: true
  end

  create_table "cryptocurrencies_pools", force: :cascade do |t|
    t.integer "cryptocurrency_role", null: false
    t.bigint "cryptocurrency_id"
    t.bigint "pool_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "amount"
    t.index ["cryptocurrency_id"], name: "index_cryptocurrencies_pools_on_cryptocurrency_id"
    t.index ["cryptocurrency_role", "cryptocurrency_id", "pool_id"], name: "by_role_and_associations", unique: true
    t.index ["pool_id"], name: "index_cryptocurrencies_pools_on_pool_id"
  end

  create_table "pools", force: :cascade do |t|
    t.bigint "protocol_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "smart_contract_id"
    t.decimal "deadline", precision: 40
    t.decimal "pending_rewards", precision: 40
    t.decimal "total_locked", precision: 40
    t.decimal "apr", precision: 30, scale: 10
    t.decimal "apy", precision: 30, scale: 10
    t.bigint "pool_id"
    t.integer "category"
    t.string "third_party_identifier"
    t.boolean "enabled", default: false
    t.index ["pool_id"], name: "index_pools_on_pool_id"
    t.index ["protocol_id"], name: "index_pools_on_protocol_id"
    t.index ["smart_contract_id"], name: "index_pools_on_smart_contract_id", unique: true
  end

  create_table "protocols", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "url", null: false
    t.integer "identifier"
  end

  create_table "smart_contracts", force: :cascade do |t|
    t.bigint "blockchain_id"
    t.string "address"
    t.string "data_hash"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "code_id"
    t.string "creator"
    t.string "label"
    t.index ["address"], name: "index_smart_contracts_on_address", unique: true
    t.index ["blockchain_id"], name: "index_smart_contracts_on_blockchain_id"
  end

  create_table "swap_paths", force: :cascade do |t|
    t.string "swap_path_as_string"
    t.bigint "from_id"
    t.bigint "to_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "swap_count", null: false
    t.index ["from_id", "to_id"], name: "index_swap_paths_on_from_id_and_to_id"
    t.index ["from_id"], name: "index_swap_paths_on_from_id"
    t.index ["swap_path_as_string", "from_id", "to_id"], name: "index_swap_paths_on_swap_path_as_string_and_from_id_and_to_id", unique: true
    t.index ["to_id"], name: "index_swap_paths_on_to_id"
  end

  add_foreign_key "cryptocurrencies", "blockchains", name: "cryptocurrencies_blockchain_id_fk"
  add_foreign_key "cryptocurrencies_pools", "cryptocurrencies", name: "cryptocurrencies_pools_cryptocurrency_id_fk"
  add_foreign_key "cryptocurrencies_pools", "pools", name: "cryptocurrencies_pools_pool_id_fk"
  add_foreign_key "pools", "pools", name: "pools_pool_id_fk"
  add_foreign_key "pools", "protocols", name: "pools_protocol_id_fk"
  add_foreign_key "pools", "smart_contracts", name: "pools_smart_contract_id_fk"
  add_foreign_key "smart_contracts", "blockchains", name: "smart_contracts_blockchain_id_fk"
  add_foreign_key "swap_paths", "cryptocurrencies", column: "from_id", name: "swap_paths_from_id_fk"
  add_foreign_key "swap_paths", "cryptocurrencies", column: "to_id", name: "swap_paths_to_id_fk"
end
