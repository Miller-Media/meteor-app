import React from 'react';
import ReactDOM from 'react-dom';
import onsen from 'onsenui';

import client from '/client/main';
import firebase from 'firebase';
import firebaseui from 'firebaseui';

import { BaseScreen, meteor_call } from 'millermedia-meteor-core';
import MainScreen from '/imports/ui/screens/main/Main';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class LoginScreen extends BaseScreen {
	
	/**
	 * @var	string			Screen title
	 */
	title = 'Sign In'

	/**
	 * Constructor
	 *
	 */
	constructor( props ) {
		super(props);

		this.state = {
			loggingIn: sessionStorage.getItem('doingLogin') === 'true',
			hideMessage: false
		};

		this.firebaseUIConfig = {
			signInFlow: 'redirect',
			credentialHelper: firebaseui.auth.CredentialHelper.NONE,
			signInOptions: [
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				"apple.com",
			],
			callbacks: {
				signInSuccessWithAuthResult: this.signInSuccess,
			}
		};

		this.unloadEvent = onsen.platform.isIOS() ? 'pagehide' : 'unload';

		if ( Meteor.isCordova && window.UserAgent ) {
			UserAgent.get(ua => {
				/* Set a custom user agent so Google oAuth will work */
				if ( ua != client.customUserAgent ) {
					localStorage.setItem('appUserAgent', ua);
					UserAgent.set(client.customUserAgent);
				}
			});
		}
	}

	/**
	 * [Lifecycle]
	 * 
	 * Set session storage doingLogin flag.
	 */
	componentDidMount() {
		sessionStorage.setItem('doingLogin', 'true');
		window.addEventListener(this.unloadEvent, this.disableStatusBarOverlay);
	}

	/**
	 * [Lifecycle]
	 * 
	 * Remove session storage doingLogin flag.
	 */
	componentWillUnmount() {
		sessionStorage.removeItem('doingLogin');
		window.removeEventListener(this.unloadEvent, this.disableStatusBarOverlay);
	}

	/**
	 * Disable the status bar overlay
	 *
	 * This is useful when redirecting to Identity Providers
	 */
	disableStatusBarOverlay() {
		if ( window.StatusBar ) {
			StatusBar.overlaysWebView(false);
		}
	}
	
	/**
	 * Get additional props to pass to the Page react component
	 *
	 * @return	object
	 */
	getPageProps() {
		return {
			contentStyle: {
				display        : 'flex',
				flexFlow       : 'column',
				justifyContent : 'center'
			},
			className: "screen-login"
		};
	}
	
	/**
	 * Get the screen content
	 *
	 * @return	object		React.Component
	 */
	getScreenContent = () => {

		return (
			<div className="login u-flex u-flexCol u-flexAlignItemsCenter text-center main-body-font-bold">
				<img className="logo" src="https://via.placeholder.com/300x150.png?text=App+Logo" alt="App logo" />
				<div className={`message u-flex u-flexCol u-flexAlignItemsCenter ${this.state.hideMessage ? 'hide' : ''}`}>
					<h2>Welcome to the App!</h2>
					<h4 style={{ fontSize: '20px' }}>
						Sign in or create a new account:
					</h4>
				</div>
				<StyledFirebaseAuth
					uiConfig={this.firebaseUIConfig} 
					firebaseAuth={client.firebase.auth()}
				/>
			</div>
		);
	}

	/**
	 * Successful firebase login
	 *
	 * @return	false
	 */
	signInSuccess = (authResult, redirectUrl) => {
		this.setState({ loggingIn: true });

		authResult.user.getIdToken().then( token => {
			meteor_call('firebaseLogin', {
				displayName: authResult.user.displayName,
				credential: authResult.credential,
				userInfo: authResult.additionalUserInfo,
				token: token,
			})
			.then(serverResult => {

				Meteor.loginWithToken(serverResult.token, (error, result) => {

					if ( error ) {
						this.setState({ loggingIn: false });
						onsen.notification.alert(error.reason);
						return;
					}

					client.track('Login');

					/* Reset user agent if needed */
					let appUserAgent = localStorage.getItem('appUserAgent');
					if ( appUserAgent ) {
						UserAgent.set(appUserAgent);
						localStorage.removeItem('appUserAgent');
					}

					if ( serverResult.isFirstLogin ) {
						client.mainNavigation.resetPageStack([{ component: MainScreen, key: 'main', props: { initial: true } }]);
					} else {
						client.mainNavigation.resetPageStack([{ component: MainScreen, key: 'main', props: { initial: true } }]);
					}
				});
			}).catch(error => {
				this.setState({ loggingIn: false });
			});
		});

		// Prevent redirect
		return false;
	}

	/**
	 * Callback for when screen is shown
	 *
	 * @return	void
	 */
	onShow = () => {
		client.notReadyForHCP();
	}
	
}
