import React from 'react';
import { BaseScreen } from 'millermedia-meteor-core';

export default class Tab1Screen extends BaseScreen {

	title = 'Tab 1'

    /**
	 * Constructor
	 *
	 * @param	object		props			Component properties
	 * @return	void
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Get the toolbar for the screen
	 *
	 * @return	object	React.Component
	 */
	getToolbar = () => {
		return false;
	}
    
	/**
	 * Get the screen content
	 *
	 * @return	object		React.Component
	 */
	getScreenContent = () => {

		return (
			<div className="themed-page medium-width text-center">
				<div style={{margin: '50% 25px 0'}}>
					<div className="icon-container">
						<div className="circle-icon-background">
							<ons-icon icon="fa-home" size="80px" style={{marginLeft:'-5px'}}></ons-icon>
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Get a classname to identify this page
	 *
	 * @return	string
	 */
	get pageClass() {
		return 'tab1-screen';
	}

}