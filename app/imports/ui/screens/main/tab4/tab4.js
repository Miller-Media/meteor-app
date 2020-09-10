import {BaseTab} from 'millermedia-meteor-core';
import Tab4Screen from '/imports/ui/screens/main/tab4/tab4-screen';

export default class Tab4Tab extends BaseTab {
	
	title = 'Tab 4'

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	constructor( props ) {
		super( props );
		this.initialScreen = { component: Tab4Screen, key: 'tab4-screen', props };
	}

}