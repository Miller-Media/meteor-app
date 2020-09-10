import {BaseTab} from 'millermedia-meteor-core';
import Tab1Screen from '/imports/ui/screens/main/tab1/tab1-screen';

export default class Tab1Tab extends BaseTab {
	
	title = 'Tab 1'

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	constructor( props ) {
		super( props );
		this.initialScreen = { component: Tab1Screen, key: 'tab1-screen', props };
	}

}