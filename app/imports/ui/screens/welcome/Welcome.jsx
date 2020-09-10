import React from 'react';
import $ from 'jquery';
import onsen from 'onsenui';

import client from '/client/main';

import { BaseScreen } from 'millermedia-meteor-core';
import LoginScreen from '/imports/ui/screens/welcome/Login';

import { Button } from 'react-onsenui';

export default class WelcomeScreen extends BaseScreen {

	/**
	 * @var     Screen ID
	 */
	screenID = 'welcome'

	/**
	 * Constructor
	 *
	 */
	constructor(props) {
		super(props);

		this.logo = React.createRef();
		this.caption1 = React.createRef();
		this.caption2 = React.createRef();
		this.hero = React.createRef();
		this.description = React.createRef();
		this.cta = React.createRef();

		this.clickCount = 0;

		this.stagingUrl = 'https://staging.app.domain.com'; // update with actual staging URL
	}

	/**
	 * Toolbar Customization
	 *
	 */
	getToolbar = () => {
		return false;
	}

	/**
	 * [Lifecycle] Component Mounted
	 *
	 */
	componentDidMount() {
		let logo = $(this.logo.current);
		let hero = $(this.hero.current);
		let caption1 = $(this.caption1.current);
		let caption2 = $(this.caption2.current);
		let description = $(this.description.current);
		let cta = $(this.cta.current);

		logo.fadeIn(1200)
			.delay(800)
			.animate({ top: '40%' }, 600, () => {
				logo.animate({ top: '-10px' }, 600).animate({ top: '0' }, 800);
				hero.delay(1500).fadeIn(700);
				hero.animate({ top: '0' }, 0).animate({ top: '0' }, 0, () => {
					cta.hide(0).queue(next => { cta.css('visibility', 'visible'); next(); }).fadeIn(700);
					caption1.delay(1000).hide(0).queue(next => { caption1.css('visibility', 'visible'); next(); }).fadeIn(800);
					caption2.delay(3000).hide(0).queue(next => { caption2.css('visibility', 'visible'); next(); }).fadeIn(800);
					description.delay(5200).hide(0).queue(next => { description.css('visibility', 'visible'); next(); }).fadeIn(600);
				});
			});
		
	}

	/**
	 * Render screen content
	 *
	 */
	getScreenContent = () => {
		
		let logoStyle = {
			display: 'none',
			position: 'relative',
			top: '35%',
		};

		let heroStyle = {
			display: 'none',
			position: 'relative',
			top: '0',
		}

		let caption1Style = {
			visibility: 'hidden',
		}

		let caption2Style = {
			visibility: 'hidden',
		}

		let descriptionStyle = {
			visibility: 'hidden',
		}

		let ctaStyle = {
			visibility: 'hidden',
		}

		return (
			<div className="welcome full-height u-flex u-flexCol u-flexJustifyBetween main-body-font-bold">
				<div ref={this.logo} style={logoStyle}>
					<img onClick={this.onLogoClick} className="logo" src="https://via.placeholder.com/300x150.png?text=App+Logo" alt="Placeholder logo" />
					{Meteor.settings.public.environment === 'staging' ? (
						<div>STAGING!</div>
					) : false }
				</div>
				<div>
					<div className="caption">
						<span ref={this.caption1} style={caption1Style}>Generic intro text...</span>
						<span ref={this.caption2} style={caption2Style}><br />And a little more.</span>
					</div>
				</div>
				<div className="medium-width" ref={this.hero} style={heroStyle}>
					<img className="hero" src="https://via.placeholder.com/300x150.png?text=Image" alt="Placeholder hero image" />
					<div className="description">
						<div ref={this.description} style={descriptionStyle} className="desc small-width">
							This is the app description. Please click below to sign in.
						</div>
						<div ref={this.cta} className="cta small-width pad20" style={ctaStyle}>
							<Button className="thm-button thm-button-light" onClick={this.onSignIn}>
								Sign In
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Enter staging app after clicking the logo enough times
	 *
	 * @return	void
	 */
	onLogoClick = () => {
		if ( Meteor.isCordova && Meteor.settings.public.environment === 'production' ) {
			if ( ++this.clickCount == 20 ) {
				MeteorMods.changeBackendUrl(this.stagingUrl, () => {
					onsen.notification.toast('Loading the Staging App...', { timeout: 3000, animation: 'fall' });
				});
			}
		}
	}

	/**
	 * Show login screen after clicking Sign In button.
	 * 
	 * @return void
	 */
	onSignIn = () => {
		client.mainNavigation.pushPage({ component: LoginScreen, key: 'login' });
	}

}