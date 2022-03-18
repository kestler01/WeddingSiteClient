/* eslint-env es6 */
/* eslint-disable */
// linter errors stopped with ^ didn't put effort into doing it the correct way prioritizing the app functionality 
const store = require('./store.js')
// https://git.generalassemb.ly/ga-wdi-boston/browser-template/issues/185
const Modal = require('bootstrap').Modal

// function to use to generate rsvp cards form api response, 
// index arg expects a bool, determines where we draw
const drawRsvpCard = function(rsvp, index) {
  // deconstruct out rsvp details
  const { Names, Attending, Notes} = rsvp
  // in index success we dont have to provide second arg
  let size = 10
  let target = 'rsvp-card-landing'
  if (index){
    target = 'rsvp-card-landing-index'
    size = 4
  }
  // 'Delighted to attend' || 'Sorry to miss it'
  let attendText = 'Delighted to attend'
  if(!Attending){
    attendText = 'Sorry to miss it'
  }

  // prepend means that the newest rsvps should be listed at the first, not that it truly matters
  $(`#${target}`).prepend(`
  <div class="col-${size} card-sleeve">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title"> RSVP </h5>
        <h3> Guests </h3>
        <p class="card-text rsvp-Names">${Names.join()}</p>
        <h3> replied: </h3>
        <p> ${attendText}</p>
        <h3> Dietary restrictions and other notes </h3>
        <p> ${Notes}</p>
      </div>
    </div>
  </div>
  `)
}

const onSignUpSuccess = function () {
  // console.log( "in ui on sign up S function")
  $('#sign-up').trigger('reset')
  $('#sign-up-form-message').text('sign up successful, log in to continue')
  $('#sign-up-flip-in-button').show()
  $('#sign-up-flip-button').hide()
}
const onSignUpFailure = function () {
  $('#sign-up-form-message').text('sign up failed, you may already have signed up using this email. If issues continue please get in touch with Andrew at kestler.andrew@gmail.com')
}


const onSignInSuccess = function (response) {
$('#sign-in-form-message').text('')
$('#sign-up-button').hide()
$('#sign-in-button').hide()
$('#sign-out-button').show()
$('#change-pw-button').show()
$('#rsvp-nav-btn').show()
$('#sign-in').trigger('reset')
$('#sign-in-form-message').text('sign in successful')
store.user = response.user
const myModal = new Modal($('#sign-in-form-modal'))
myModal._hideModal()
$('.modal-backdrop').hide() 
// jank alternative close because Bootstrap 5 is very particular
}

const onNotSignedIn = function () {
  const myModal = new Modal($('#sign-in-form-modal'))
  $('#sign-in-form-message').text('please sign in to rsvp')
	myModal.show()
}

const onSignInFailure = function () {
    $('#sign-in-form-message').text('sign in failure')
		$('#message-field').text('sign in failure')
		$('#sign-in').trigger('reset')
}

const onChangePwSuccess = function () {
    $('#pw-change-message-field').text('password updated')
}
const onChangePwFailure = function () {
  $('#change-password').trigger('reset')
	$('#pw-change-message-field').text('password change failed')
}

const onSignOutSuccess = function () {
  $('#message-field').text('you signed out')
	$('#sign-up-button').show()
	$('#sign-in-button').show()
	$('#sign-out-button').hide()
	$('#change-pw-button').hide()
  $('#rsvp-nav-btn').hide()

  store.user = null // commented out in other project ?
}
const onSignOutFailure = function () {
  $('#message-field').text('sign out failure')
}

const onIndexRsvpsSuccess = function (response) {
  if( response.rsvp.length === 0 || !response.rsvp){
    // if we don't get an rsvp back form the api then nobody has rsvped yet and we should let the user know that instead of thinking something went wrong
    $('#rsvp-card-landing-index').text(
			"Still waiting for responses, but I'm sure they will be in soon"
		)
  } 
  response.rsvp.forEach(rsvp => drawRsvpCard(rsvp))
}
const onIndexRsvpsFailure = function (response) {
  console.log('Something went wrong with the Index call. The API response was:',response)
}

const onNewRsvpSuccess = function (response) {

  console.log(response)
  // close api form modal - may close when other opens
  // const myModal = new Modal($('#new-rsvp-form-modal'))
	// myModal._hideModal()
	// $('.modal-backdrop').hide()
  drawRsvpCard(store.rsvp, false)
  const nextModal = new Modal($('#view-rsvp-modal'))
  nextModal.show()
	// open the view rsvp form modal

	// update the am i rsvped light ? (not yet implemented)
  store.user.isRsvped = true
	// update the stored users isRsvped to true
}
const onNewRsvpFailure = function (response) {
  console.log(response)
  $('#new-rsvp-message-field').text('Sorry something went wrong')
}

const onGetRsvpSuccess = function (response) {
  // we got the rsvp, somebody is likely trying to update or double check the details,
  // lets draw the rsvp card on the view modal and pre fill the update modal (only openable from the view modal)
}

const onGetRsvpFailure = function ( response) {
	// IF user isn't rsvped ( is a field on the user model) then open the new rsvp form modal
	// failed to get the rsvp, oops lets log an error and display it on the view rsvp modal message field
}
  
const onUpdateRsvpSuccess = function ( response) {
	// we've updated the rsvp YAY, lets draw the newest corrected details on the view rsvp modal and show that (and hide the update modal)
	drawRsvpCard(store.rsvp, false)
	const myModal = new Modal($('#update-rsvp-form-modal'))
	myModal._hideModal()
	$('.modal-backdrop').hide()
}
const onUpdateRsvpFailure = function (response ) {
  // theres been a weird error here... lets present an error message to the user on the update form modal and tell them to check the internet connection or contact me
}
const onNotRsvped = function () {
  const myModal = new Modal(
		document.getElementById('new-rsvp-form-modal')
	)
	console.log(
		'in onNotRsvped from onRsvpBtnClick-and user.isRsvped=== false, myModal:',
		myModal
	)
	// trigger the new-rsvp-form-modal
	myModal.show()
}

// const onDeleteRsvpSuccess = function (response) {
//   // WHY would somebody do this?! i don't know and don't think i will have it be an option !!
//   // IF somebody not invited decides to rsvp... that would be RUDE
// }
// onDeleteRsvpFailure

module.exports = {
	onSignUpSuccess,
	onSignUpFailure,
	onSignInSuccess,
	onSignInFailure,
	onChangePwSuccess,
	onChangePwFailure,
	onSignOutSuccess,
	onSignOutFailure,
	onIndexRsvpsSuccess,
	onIndexRsvpsFailure,
	onNewRsvpSuccess,
	onNewRsvpFailure,
	onGetRsvpSuccess,
	onGetRsvpFailure,
	onUpdateRsvpSuccess,
	onUpdateRsvpFailure,
	onNotSignedIn,
  onNotRsvped
}