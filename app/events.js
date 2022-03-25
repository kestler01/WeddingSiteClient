/* eslint-env es6 */
/* eslint-disable */
const api = require('./api.js')
const ui = require('./ui.js')
const getFormFields = require('../lib/get-form-fields.js')
const store = require('./store.js')

const onSignUp = function (event) {
	// console.log(event)
	event.preventDefault()
	const formDataRaw = event.target
	// console.log("formDataRaw:",formDataRaw) // dev log
	const formDataObj = getFormFields(formDataRaw)
	// hardcoded emails for admins (bride and groom) only enables access to rsvp list
	// console.log(formDataObj)
	// console.log(
	// 	'formDataObj.credentials.email== "kestler.andrew@gmail.com"',
	// 	formDataObj.credentials.email.valueOf() == 'kestler.andrew@gmail.com'
	// )
	// console.log(
	// 	'formDataObj.credentials.email== "amanda@kiddschall.com"',
	// 	formDataObj.credentials.email.valueOf() == 'amanda@kiddschall.com'
	// )

	if (
		formDataObj.credentials.email.trim().valueOf() == 'kestler.andrew@gmail.com' ||
		formDataObj.credentials.email.trim().valueOf() == 'amanda@kiddschall.com'
	) {
		// console.log('admin detected')
		formDataObj.credentials.isAdmin = true
	}
	// console.log("formDataObj:", formDataObj) // dev log
	api.signUp(formDataObj)
		.then(ui.onSignUpSuccess)
		.catch(ui.onSignUpFailure)
	return false
}

const onSignIn = function (event) {
	event.preventDefault()
	const formDataRaw = event.target
	// console.log(formDataRaw) // dev log
	const formDataObj = getFormFields(formDataRaw)
	// console.log(formDataObj) // dev log
	api.signIn(formDataObj)
			.then((user) => ui.onSignInSuccess(user)) 
			// passing the user object returned form the api so we can store it ( to check isAdmin, and to attach to our authenticated routes in api.js)
			.catch(ui.onSignInFailure)
}

const onChangePw = function (event) {
	event.preventDefault()
	const formDataRaw = event.target
	// console.log(formDataRaw)
	const formDataObj = getFormFields(formDataRaw)
	// console.log(formDataObj)
	api
		.changePw(formDataObj)
		.then(ui.onChangePwSuccess)
		.catch(ui.onChangePwFailure)
}

const onSignOut = function () {
	api.signOut()
		.then(ui.onSignOutSuccess)
		.catch(ui.onSignOutFailure)
}


// events.js:59 
// {rsvp: {…}}
// rsvp:
// Attending: "Delighted to attend"
// names: "Me, Myself,  I"
// notes: "testing"
const onNewRsvp = function (event) {
	event.preventDefault()
	const formDataRaw = event.target
	const formDataObject = getFormFields(formDataRaw)
	// console.log(formDataObject)
	// destructure out data collected from form
	const { Attending, names, notes} = formDataObject.rsvp
	// initialize  new object we will format to match API requirements 
	// see WeddingSiteAPI/app/models/rsvp.js
	let formattedRsvp = {}
	// split the names into an array so we can count them+ have correct data type
	let NamesArray = names.split(',')
	// interpret test to bool value
	if (Attending === 'Delighted to attend') {
		formattedRsvp.Attending = true
		formattedRsvp.NumberAttending = NamesArray.length
	} else { 
		formattedRsvp.Attending = false
		formattedRsvp.NumberAttending = 0
	}
	formattedRsvp.Notes = notes
	formattedRsvp.Names = NamesArray
	// console.log( " onNewRsvp the formattedRsvp obj is :", formattedRsvp)
	store.rsvp = formattedRsvp
	api
		.postRsvp({"rsvp":formattedRsvp})
		.then(ui.onNewRsvpSuccess)
		.catch(ui.onNewRsvpFailure)
}

const onViewRsvp = function (event) {
	// event.preventDefault()
	api.getRsvp()
		.then(ui.onGetRsvpSuccess)
		.catch(ui.onGetRsvpFailure)
}

const onIndexRsvps = function (event) {
	// event.preventDefault()
	api.indexRsvps()
		.then(ui.onIndexRsvpsSuccess)
		.catch(ui.onIndexRsvpsFailure)
}

const onUpdateRsvp = function (event) {
	event.preventDefault()
	const formDataRaw = event.target
	const formDataObject = getFormFields(formDataRaw)
	const { Attending, names, notes } = formDataObject.rsvp
	// initialize  new object we will format to match API requirements
	// see WeddingSiteAPI/app/models/rsvp.js
	let formattedRsvp = {}
	// split the names into an array so we can count them+ have correct data type
	let NamesArray = names.split(',')
	// interpret test to bool value
	if (Attending === 'Delighted to attend') {
		formattedRsvp.Attending = true
		formattedRsvp.NumberAttending = NamesArray.length
	} else {
		formattedRsvp.Attending = false
		formattedRsvp.NumberAttending = 0
	}
	formattedRsvp.Notes = notes
	formattedRsvp.Names = NamesArray
	// console.log( " onNewRsvp the formattedRsvp obj is :", formattedRsvp)
	store.rsvp = formattedRsvp
	api.updateRsvp({"rsvp":formattedRsvp})
		.then(ui.onUpdateRsvpSuccess)
		.catch(ui.onUpdateRsvpFailure)
}

// const onDeleteRsvp = function () {
// 	api.deleteRsvp()
// 		.then(ui.onDeleteRsvpSuccess)
// 		.catch(ui.onDeleteRsvpFailure)
// }

const onRsvpBtnClick = function (e) {
	// console.log('in onrsvpbuttonclick, the event =',e)
	// console.log('store =',store)
	// console.log('!store?.user =', !store?.user)
	if(!store?.user){
		// console.log('inside 1st condition of onrsvpbuttonclick')
		ui.onGetRsvpFailure()
	} else if(store.user.isAdmin=== true){
		// console.log('inside 2nd condition of onrsvpbuttonclick')
		onIndexRsvps()
	} else if(store.user.isRsvped=== true){
		// console.log('inside 3rd condition of onrsvpbuttonclick')
		onViewRsvp()
	} else if(store.user.isRsvped=== false){
		// console.log('inside 4th condition of onrsvpbuttonclick')
		ui.onNotRsvped()
	}
}
module.exports = {
	onSignUp,
	onSignIn,
	onChangePw,
	onSignOut,
	onNewRsvp,
	onViewRsvp,
	onIndexRsvps,
	onUpdateRsvp,
	// onDeleteRsvp,
	onRsvpBtnClick,
}
