import {BaseTab} from 'millermedia-meteor-core';
import Tab3Screen from '/imports/ui/screens/main/tab3/tab3-screen';

export default class Tab3Tab extends BaseTab {
	
	title = 'Tab 3'

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	constructor( props ) {
		super( props );
		this.initialScreen = { component: Tab3Screen, key: 'tab3-screen', props };
	}

}