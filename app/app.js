// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
const events = require('./events.js')
const store = require('./store.js')

// let eventFunctionByUserAccessLevel = events.onViewRsvp
// if (store?.user?.isAdmin === true) {
//   eventFunctionByUserAccessLevel = events.onIndexRsvps
// }

$(() => {
  $('#my-sign-up').on('submit', events.onSignUp)
  $('#sign-in').on('submit', events.onSignIn)
  $('#change-password').on('submit', events.onChangePw)
  $('#sign-out-button').on('click', events.onSignOut)
  // $('#rsvp').on('submit', eventFunctionByUserAccessLevel)
  $('#new-rsvp-form-modal').on('submit', events.onNewRsvp)
  $('#rsvp-nav-btn').on('click', events.onRsvpBtnClick)
  $('#update-rsvp').on('submit', events.onUpdateRsvp)
})
