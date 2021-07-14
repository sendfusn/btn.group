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

ActiveRecord::Schema.define(version: 2021_07_14_221250) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "blockchains", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "cryptocurrencies", force: :cascade do |t|
    t.integer "decimals", null: false
    t.string "name", null: false
    t.string "symbol", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "price", precision: 8, scale: 6
    t.bigint "smart_contract_id"
    t.index ["smart_contract_id"], name: "index_cryptocurrencies_on_smart_contract_id"
  end

  create_table "cryptocurrencies_pools", force: :cascade do |t|
    t.integer "cryptocurrency_role", null: false
    t.bigint "cryptocurrency_id"
    t.bigint "pool_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["cryptocurrency_id"], name: "index_cryptocurrencies_pools_on_cryptocurrency_id"
    t.index ["pool_id"], name: "index_cryptocurrencies_pools_on_pool_id"
  end

  create_table "pools", force: :cascade do |t|
    t.bigint "protocol_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "smart_contract_id"
    t.index ["protocol_id"], name: "index_pools_on_protocol_id"
    t.index ["smart_contract_id"], name: "index_pools_on_smart_contract_id"
  end

  create_table "protocols", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "smart_contracts", force: :cascade do |t|
    t.bigint "blockchain_id"
    t.string "address"
    t.string "hash"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["blockchain_id"], name: "index_smart_contracts_on_blockchain_id"
  end

end
