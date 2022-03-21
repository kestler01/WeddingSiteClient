const events = require('./events.js')

$(() => {
  $('#my-sign-up').on('submit', events.onSignUp)
  $('#sign-in').on('submit', events.onSignIn)
  $('#change-password').on('submit', events.onChangePw)
  $('#sign-out-button').on('click', events.onSignOut)
  $('#new-rsvp-form-modal').on('submit', events.onNewRsvp)
  $('#rsvp-nav-btn').on('click', events.onRsvpBtnClick)
  $('#update-rsvp').on('submit', events.onUpdateRsvp)
})
