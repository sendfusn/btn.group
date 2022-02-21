# frozen_string_literal: true

Rails.application.config.middleware.insert_before Rack::Runtime, Rack::Timeout, service_timeout: 45, wait_timeout: 45, wait_overtime: 45
