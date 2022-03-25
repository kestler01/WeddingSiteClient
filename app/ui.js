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
  let noteTitle = `Dietary restrictions and other notes`
  if (index){
    target = 'rsvp-card-landing-index'
    size = 4
    noteTitle = `Notes`
  } else {
  $(`#${target}`).html('') // need clear for update not double drawing
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
        <div class="row justify-content-center text-center"">
          <h2 class="col-10 card-title text-decoration-bold"> A|A </h2>
          <h5 class="text-decoration-underline"> Guests </h5>
          <p class="card-text rsvp-card-text rsvp-Names">${Names.join()}</p>
          <h5 class="text-decoration-underline"> replied: </h5>
          <p class="card-text rsvp-card-text rsvp-Attending-text"=> ${attendText}</p>
          <h5 class="text-decoration-underline"> ${noteTitle} </h5>
          <p class="card-text rsvp-card-text rsvp-Notes-text"> ${Notes}</p>
        </div>
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
  // console.log(response)
$('#sign-in-form-message').text('')
$('#sign-up-button').hide()
$('#sign-in-button').hide()
$('#sign-out-button').show()
$('#change-pw-button').show()
// $('#rsvp-nav-btn').show()
$('#sign-up-button-div').hide()
$('#sign-in-button-div').hide()
$('#sign-out-button-div').show()
$('#change-pw-button-div').show()
// $('#rsvp-nav-btn-div').show()
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
  // $('#rsvp-nav-btn').hide()
  $('#sign-up-button-div').show()
	$('#sign-in-button-div').show()
	$('#sign-out-button-div').hide()
	$('#change-pw-button-div').hide()
  // $('#rsvp-nav-btn-div').hide()
  $('#change-password').trigger('reset')
  $('#sign-up').trigger('reset')
  $('#sign-in').trigger('reset')
  $('#sign-in-form-message').text('')
  $('#sign-up-form-message').text('')
  store={}
}
const onSignOutFailure = function () {
  $('#message-field').text('sign out failure')
}

const onIndexRsvpsSuccess = function (response) {
  // console.log('index rsvp success', response)
  $('#rsvp-card-landing-index').html(' ')
  if( response.rsvps?.length === 0 || !response.rsvps){
    // if we don't get an rsvp back form the api then nobody has rsvped yet and we should let the user know that instead of thinking something went wrong
    $('#rsvp-card-landing-index').text(
			"Still waiting for responses, but I'm sure they will be in soon"
		)
  } else {
  response.rsvps.forEach(rsvp => drawRsvpCard(rsvp, true))
  }
    const myModal = new Modal($('#view-rsvps-modal'))
		myModal.show()
}

const onIndexRsvpsFailure = function (response) {
  console.log('Something went wrong with the Index call. The API response was:',response)
}

const onNewRsvpSuccess = function (response) {

  // console.log(response)
  // close api form modal - may close when other opens
  const myModal = new Modal($('#new-rsvp-form-modal'))
	myModal._hideModal()
	$('.modal-backdrop').hide()

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
	// console.log(response)

	// we need to clean the card-landing off first
	$('#rsvp-card-landing').html(' ')

  if(store?.rsvp != response.rsvp){
    store.rsvp = response.rsvp
  }
	
	drawRsvpCard(store.rsvp, false)
	const myModal = new Modal($('#view-rsvp-modal'))
	myModal.show()
	// lets draw the rsvp card on the view modal and pre fill the update modal (only openable from the view modal) ?
}

const onGetRsvpFailure = function ( response) {
	// IF user isn't rsvped ( is a field on the user model) then open the new rsvp form modal
  console.log('in ui `ongetrsvpfalialure`')
  if(!store?.user){ // no user yet
    const myModal = new Modal($('#sign-in-form-modal'))
        $('#sign-in-form-message').text('Please register your email and sign in to RSVP <br> Not registered ? sign up below')
    myModal.show()
  } else if(!store.user.isRsvped){ // user isn't rsvped
    const myModal = new Modal($('#new-rsvp-form-modal'))
    myModal.show()
    $('#new-rsvp-message-field').text('Please fill out this form to RSVP')
  } else if(store?.rsvp){// theres a stored rsvp
    drawRsvpCard(store.rsvp, false)
    const myModal = new Modal($('#new-rsvp-form-modal'))
    myModal.show()
  } else { // if there IS a user, Who is RSVPED, and No rsvp in store, then something odd is going on - look at serve response 
    console.log(response)
  }
}
  
const onUpdateRsvpSuccess = function ( response) {
	// we've updated the rsvp YAY, lets draw the newest corrected details on the view rsvp modal and show that (and hide the update modal)
  // console.log(response)
	drawRsvpCard(store.rsvp, false)
	const myModal = new Modal($('#update-rsvp-form-modal'))
	myModal._hideModal()
	$('.modal-backdrop').hide()
  const nextModal = new Modal($('#view-rsvp-modal'))
	nextModal.show()
}
const onUpdateRsvpFailure = function (response ) {
  console.log(response)
  $('#update-rsvp-message-field').text(`I'm sorry, something went wrong. If the issue persists contact Andrew, the server may be down`)
  // theres been a weird error here... lets present an error message to the user on the update form modal and tell them to check the internet connection or contact me
}
const onNotRsvped = function () {
  const myModal = new Modal(
		document.getElementById('new-rsvp-form-modal')
	)
	// console.log(
	// 	'in onNotRsvped from onRsvpBtnClick-and user.isRsvped=== false, myModal:',
	// 	myModal
	// )
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