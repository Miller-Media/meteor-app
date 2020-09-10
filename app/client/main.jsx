import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import $ from 'jquery';

import onsen from 'onsenui';
import { App, Client, startup } from 'millermedia-meteor-core';

/* Styles */
import 'onsenui/css/onsenui.min.css'; 
import 'onsenui/css/onsen-css-components.min.css';
import 'animate.css';
import 'suitcss-utils-flex';
import '/imports/ui/styles/main.less';

/* Services */
import firebase from 'firebase';

/* Screens */
import WelcomeScreen from '/imports/ui/screens/welcome/Welcome';
import LoginScreen from '/imports/ui/screens/welcome/Login';
import MainScreen from '/imports/ui/screens/main/Main';

class ClientApp extends Client {

	/**
	 * @var	array|object 		A single route or a stack of routes {
	 *    component: 	(object[React.Component])(required)  The screen to load
	 *    props: 		(object)(optional)                   Properties to pass to the screen
	 * }
	 */
	_initialRoute = null
	
	/**
	 * Constructor
	 *
	 */
	constructor() {
		super();
		this.app = React.createRef();

		this.userData = Meteor.subscribe('userData');
	}

	get mainNavigation() {
		return this.app.current.navigation.current;
	}

	/**
	 * Get the initial route for the app
	 *
	 * @return	object|array  {
	 *    component: 	(object[React.Component])(required)  The screen to load
	 *    props: 		(object)(optional)                   Properties to pass to the screen
	 * }
	 */
	get initialRoute() {
		if ( this._initialRoute ) {
			return this._initialRoute;
		}

		/* Resume Login */
		if ( sessionStorage.getItem('doingLogin') ) {
			return [{ component: WelcomeScreen }, { component: LoginScreen }];
		}
		
		return Meteor.userId() ? { component: MainScreen } : { component: WelcomeScreen };
	}

	/**
	 * Allow setting a custom user agent for oauth
	 *
	 * This is necessary for the oAuth login flow for Google, which
	 * disallows the process for web view user agents
	 *
	 * @see: https://stackoverflow.com/questions/40591090/403-error-thats-an-error-error-disallowed-useragent
	 */
	get customUserAgent() {
		if ( onsen.platform.isIOS() ) {
			return "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
		}

		return "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
	}

	/**
	 * Login Callback
	 *
	 * @return void
	 */
	onLogin = login => {
		if ( window.mixpanel ) {
			mixpanel.identify(Meteor.userId());
			if ( Meteor.user() ) {
				let fullname = Meteor.user().profile?.fullname;
				let email = Meteor.user().emails?.pop()?.address;
				
				if ( fullname ) {
					mixpanel.people.set('$name', fullname);
				}

				if ( email ) {
					mixpanel.people.set('$email', email);
				}
			}
		}
	}

	/**
	 * Logout Callback
	 *
	 * @return void
	 */
	onLogout = error => {
		if ( ! error ) {
			this.track('Logout', {}, { send_immediately: true });
			if ( window.mixpanel ) {
				mixpanel.reset();
			}

			this.mainNavigation.resetPageStack([{ component: LoginScreen, props: { initial: true } }]);
		} else {
			onsen.notification.alert( error.message );
		}
	}

	/**
	 * Attach Event Listeners
	 *
	 */
	attachListeners() {
		if ( ! Meteor.isCordova ) {
			this.firebase = firebase.initializeApp(Meteor.settings.public.firebase);
		}

		/* Device Ready */
		document.addEventListener('deviceready', () => {
			this.firebase = firebase.initializeApp(Meteor.settings.public.firebase);
		});
	}

}

const client = new ClientApp();

Meteor.startup(() => {

	let initialRoute = Meteor.isCordova || location.href.startsWith('http://localhost:3000') ? 
		client.initialRoute : 	// Mobile App
		client.initialRoute;	// Web Version

	if ( window.StatusBar ) {
		StatusBar.backgroundColorByHexString("#F9F3DE");
	}

	/* Login/Logout Callbacks */
	Accounts.onLogin(client.onLogin);
	Accounts.onLogout(client.onLogout);

	client.attachListeners();

	startup(client, () => {
		setTimeout(() => {
			render(
				<App ref={client.app} initialRoute={initialRoute} />,
				document.getElementById('app-container')
			);
		}, 500);
	});

});

export default client;
