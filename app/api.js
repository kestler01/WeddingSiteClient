/* eslint-env es6 */
/* eslint-disable */
const config = require('./config.js')
const store = require('./store.js')

const signUp = function (dataObj) {
	return $.ajax({
		url: config.apiUrl + '/sign-up',
		method: 'POST',
		data: dataObj,
	})
}

const signIn = function (dataObj) {
	// console.log(dataObj)
	return $.ajax({
		url: config.apiUrl + '/sign-in',
		method: 'post',
		data: dataObj,
	})
}

const changePw = function (dataObj) {
	// console.log(dataObj, store.user.token)
	return $.ajax({
		url: config.apiUrl + '/change-password',
		method: 'patch',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
		data: dataObj,
	})
}

const signOut = function () {
	return $.ajax({
		url: config.apiUrl + '/sign-out',
		method: 'delete',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
	})
}

const postRsvp = function (dataObj) {
	return $.ajax({
		url: config.apiUrl + '/rsvp',
		method: 'post',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
		data: dataObj,
	})
}

const getRsvp = function () {
	return $.ajax({
		url: config.apiUrl + '/rsvp',
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
	})
}

const updateRsvp = function () {
	return $.ajax({
		url: config.apiUrl + '/rsvp',
		method: 'patch',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
		data: dataObj,
	})
}

const deleteRsvp = function () {
	return $.ajax({
		url: config.apiUrl + '/rsvp',
		method: 'delete',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
	})
}

const indexRsvps = function () {
	return $.ajax({
		url: config.apiUrl + '/rsvps',
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + store.user.token,
		},
	})
}
module.exports= {
	signUp,
	signIn,
	changePw,
	signOut,
	postRsvp,
	getRsvp,
	updateRsvp,
	deleteRsvp,
	indexRsvps,
}
