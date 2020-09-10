import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { Server } from 'millermedia-meteor-core';
import firebase from 'firebase-admin';
import _ from 'lodash';

/* Server API */
import '/server/api/users';

class ServerApp {

  constructor() {

    this.firebaseAdmin = firebase.initializeApp({
		credential: firebase.credential.cert(Meteor.settings.firebaseServiceAccount),
		databaseUrl: Meteor.settings.public.firebase.databaseUrl,
    });
    
  }

}

Meteor.startup(() => {

	/**
	 * Create new user based on login service type. 
	 * 
	 */
	Accounts.onCreateUser( (options, user) => {

		if (options._id) {
			user._id = options._id;
		}

		if (options.profile) {
			user.profile = options.profile;

			// Set `publicProfile` data on user object.
			let { fullname } = options.profile;
			if ( fullname ) {
				let { firstName, lastName } = splitFullName(fullname);
				user.publicProfile = { fullname, firstName, lastName };
			}
		}

		return user;
	});

	/**
	 * Run any necessary logic on user login. 
	 * 
	 */
	Accounts.onLogin( data => {
		let _id = _.get(data, 'user._id');

		// Set `publicProfile` data if it doesn't exist.
		if ( !_.get(data, 'user.publicProfile') ) {
			let fullname = _.get(data, 'user.profile.fullname');
			let { firstName, lastName } = splitFullName(fullname);
			let publicProfile = { fullname, firstName, lastName };

			Meteor.users.update({ _id }, { $set: { publicProfile } });
		}
	});

});

/**
 * Split a fullname string (e.g. "Barack Obama") into first
 * and last names. 
 * 
 * @param {string} fullname 
 * @return {object}
 */
function splitFullName( fullname ) {
	let result = {
		firstName: '',
		lastName: ''
	}

	if ( !fullname || !fullname.includes(' ') ) {
		return result;
	}

	let names = fullname.split(' ');
	result.firstName = names[0];
	result.lastName = names[names.length-1];

	return result;
}

const server = new ServerApp();
export default server;
