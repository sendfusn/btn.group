# frozen_string_literal: true

Immigrant.ignore_keys = [
  { from_table: 'cryptocurrencies', column: 'smart_contract_id' }
]
