import server from '/server/main.js';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';

/**
 * Create 'text' index on publicProfile fields to 
 * support search queries. 
 * 
 */
Meteor.users.rawCollection().createIndex({
	'publicProfile.fullname': 'text',
	'publicProfile.firstName': 'text',
	'publicProfile.lastName': 'text'
});

/**
 * Restrict updatable fields on the user document. 
 * 
 */
Meteor.users.allow({
	update: function (userId, doc, fields, modifier) {
		let allowed_fields = ['profile', 'publicProfile'];
		return fields.every( field => allowed_fields.includes(field) );
	}
});

/* Publish specific user data */
Meteor.publish('userData', function() {
	if ( this.userId ) {
		return Meteor.users.find({ _id: this.userId }, {
			fields: { 
				publicProfile: true
			}
		});
	}

	this.ready();
});

Meteor.methods({

	/**
	 * Handle login using Firebase Authentication
	 *
	 */
	firebaseLogin( auth ) {
		return server.firebaseAdmin.auth().verifyIdToken(auth.token).then(decodedToken => {
			let _id = decodedToken.uid;
			let user = Meteor.users.findOne({ _id });
			let isFirstLogin = false;
			
			if ( ! user ) {
				let email = Accounts.findUserByEmail(decodedToken.email) ? undefined : decodedToken.email;
				Accounts.createUser({ _id, email, username: _id, profile: { fullname: auth.displayName } });
				isFirstLogin = true;
			}

			let stampedLoginToken = Accounts._generateStampedLoginToken();
			Accounts._insertLoginToken(_id, stampedLoginToken);

			return { ...stampedLoginToken, isFirstLogin };
		});
	},
	
	/**
	 * Handle user search. 
	 * 
	 * @param {string} search 
	 */
	async searchUsers( search ) {
		if ( !this.userId ) {
			return { error: 'Must be logged in to search' };
		}

		const query = !search ? {} : { $text: { $search: search } };
		const fields = { fields: { publicProfile: 1, createdAt: 1 } };

		let users = await Meteor.users.find(query, fields).fetch();
		users = _.map(users, user =>  ({ 
			...user.publicProfile, 
			user_id: user._id, 
			dateJoined: user.createdAt 
		}));

		return { users, search }
	}

});