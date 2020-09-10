import {BaseTab} from 'millermedia-meteor-core';
import Tab2Screen from '/imports/ui/screens/main/tab2/tab2-screen';

export default class Tab2Tab extends BaseTab {
	
	title = 'Tab 2'

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	constructor( props ) {
		super( props );
		this.initialScreen = { component: Tab2Screen, key: 'tab2-screen', props };
	}

}