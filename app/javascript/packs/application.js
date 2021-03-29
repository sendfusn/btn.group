// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// BOOTSTRAP
import 'bootstrap/js/src/alert'
import 'bootstrap/js/src/button'
import 'bootstrap/js/src/carousel'
import 'bootstrap/js/src/collapse'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/modal'
import 'bootstrap/js/src/popover'
import 'bootstrap/js/src/scrollspy'
import 'bootstrap/js/src/tab'
import 'bootstrap/js/src/toast'
import 'bootstrap/js/src/tooltip'
require("jquery")

Rails.start()
ActiveStorage.start()

// APP
import '../src/aliases/search'
import '../src/aliases/edit'
