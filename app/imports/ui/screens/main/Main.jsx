import React from 'react';
import ReactDOM from 'react-dom';
import { BaseScreen } from 'millermedia-meteor-core';
import PropTypes from 'prop-types';

/* Tab Components */
import Tab1Tab from '/imports/ui/screens/main/tab1/tab1';
import Tab2Tab from '/imports/ui/screens/main/tab2/tab2';
import Tab3Tab from '/imports/ui/screens/main/tab3/tab3';
import Tab4Tab from '/imports/ui/screens/main/tab4/tab4';

import client from '/client/main';
import { Tabbar, Tab, Toolbar } from 'react-onsenui';
import _ from 'lodash';

export default class MainScreen extends BaseScreen {
    
	/**
	 * @var     Screen ID
	 */
	screenID = 'main'
    
	static propTypes = {
		tabIndex: PropTypes.number,
	}
    
	/**
	 * @var	object		Default props
	 */
	static defaultProps = {
		tabIndex: 0,
	}

	/**
	 * Constructor
	 *
	 */
	constructor(props) {
		super(props);

		let tabsConfig = [
			{ component: Tab1Tab, title: 'Tab 1', icon: 'fa-home', props: { setCustomToolbar: this.setCustomToolbar } },
			{ component: Tab2Tab, title: 'Tab 2', icon: 'fa-book', props: { setCustomToolbar: this.setCustomToolbar } },
			{ component: Tab3Tab, title: 'Tab 3', icon: 'fa-comment-alt-exclamation', props: { setCustomToolbar: this.setCustomToolbar } },
			{ component: Tab4Tab, title: 'Tab 4', icon: 'fa-user', props: { setCustomToolbar: this.setCustomToolbar } },
		];

		let customToolbar = {}
		tabsConfig.forEach( tab => customToolbar[tab.title] = null );

		this.state = {
			delayedClass: this.props.tabIndex == 0 ? 'delayed' : '',
			tabIndex: this.props.tabIndex,
			customToolbar
		}

		this.tabs = [ ...tabsConfig ];
		this.tabsRef = React.createRef();
		this.renderTabs = this.renderTabs.bind(this);

		client.mainScreen = this;
	}

	/**
	 * Handle logic just before tab index is changed.
	 * 
	 * @param {number} index 
	 */
	onPreChangeTab = event => {
		if( event.index !== undefined ) {
			this.setState({ tabIndex: event.index }); 
		}

		event.stopPropagation();
	}

	/**
	 * Handle logic just after tab index is changed.
	 * 
	 * @param {number} index 
	 */
	onPostChangeTab = event => {
		if ( event.target === ReactDOM.findDOMNode(this.tabsRef.current) ) {
			let delayedClass = event.index == 0 ? 'delayed' : '';
			setTimeout(() => this.setState({ delayedClass }), delayedClass ? 250 : 0);
		}
	}
	
	/**
	 * Get the screen content
	 *
	 * @return	object		React.Component
	 */
	getScreenContent = () => {
		return ([
			<Tabbar
				key="main-tabbar"
				ref={this.tabsRef}
				position='bottom'
				onPreChange={this.onPreChangeTab}
				onPostChange={this.onPostChangeTab}
				index={this.state.tabIndex}
				renderTabs={this.renderTabs}
				onReactive={this.resetScreen}
				disable-auto-styling
				className={'main-tabbar-bottom active-main-tab-' + this.state.tabIndex + ' ' + this.state.delayedClass}
			/>
		]);
	}

	/**
	 * Reset the current tab screen
	 *
	 */
	resetScreen = () => {
		let subscreen = this.getActiveSubscreen();
		if ( subscreen && subscreen.resetScreen ) {
			subscreen.resetScreen();
		}
	}
	
	/**
	 * Render tabs for the screen
	 *
	 * @param	int			activeIndex				The currently active tab index
	 * @param	Tabbar		tabbar					The tab bar component
	 * @return	array[object] {
	 *		tab:		<Tab>				The tab selector
	 * 		content: 	<TabPage>			The tab content
	 * }
	 */
	renderTabs( activeIndex, tabbar ) {
		return this.getTabs().map( ( tab, index ) => ({
			tab: (
				<Tab key={tab.key || tab.component.name} class={tab.class} disable-auto-styling>
					{this.renderTabButtonContent(tab)}
				</Tab>
			),
			content: <tab.component ref={tab.instance} active={activeIndex === index} screen={this} tabbar={tabbar} key={tab.key || tab.component.name} {...(tab.props || {})} {...this.state} />
		}));
	}

	/**
	 * Render content of tab button.
	 * 
	 * This implementation allows use of custom icons, including Font Awesome PRO icons,
	 * as well as switching between icons depending on currently active tab.
	 * 
	 * @param {object} tab 
	 */
	renderTabButtonContent = tab => {
		let iconClass = this.getTabs()[this.state.tabIndex]?.title === tab.title ? `fas ${tab.icon}` : `fal ${tab.icon}`;

		return ([
			<input key={`${tab.title}-input`} type="radio" style={{ display: 'none' }}/>,
			<button key={`${tab.title}-button`} className="tabbar__button">
				<div className="tabbar__icon">
					<i className={`${iconClass}`}></i>
				</div>
				<div className="tabbar__label">{tab.title}</div>
			</button>
		])
	}
	
	/**
	 * Get tabs for the screen
	 *
	 * @return	array
	 */
	getTabs() {
		if ( this._tabs ) { 
			return this._tabs;
		}

		this._tabs = this.tabs.map(tab => {
			tab.instance = React.createRef();
			return tab;
		});

		return this._tabs;
	}
	
	/**
	 * Get the title for the page
	 *
	 * @return	object	React.Component
	 */
	getTitle = () => {
		let { title, showLogo } = this.getTabs()[ this.state.tabIndex ];

		return ( 
			<div className="toolbar-title center flex flex-column content-align-center items-align-center">
				{ showLogo ? <img src="https://via.placeholder.com/300x150.png?text=App+Logo" className="toolbar-logo"/> : title }
			</div>
		);
	}

	/**
	 * Get the toolbar for the screen. If the current tab has a custom
	 * toolbar set, use that; otherwise, use default toolbar.
	 *
	 * @return	object	React.Component
	 */
	getToolbar = () => {
		let currentTab = this.getTabs()[this.state.tabIndex];
		if ( this.state.customToolbar[currentTab.title] ) {
			return (
				this.state.customToolbar[currentTab.title]
			);
		}

		return (
			<Toolbar>
				{this.getToolbarLeft()}
				{this.getTitle()}
				{this.getToolbarRight()}
			</Toolbar>
		);
	}
	
	/**
	 * Get the right toolbar buttons
	 *
	 * @return	object	React.Component
	 */
	getToolbarRight = () => {
		return (
			<div className="right toolbar__right">
				<ons-toolbar-button>
					<ons-icon icon="fa-user-friends" class=" toolbar-icon"/>
				</ons-toolbar-button>
			</div>
		);
	}

	/**
	 * Get the left toolbar buttons
	 *
	 * @return	object	React.Component
	 */
	getToolbarLeft = () => {
		return (
			<div className="left toolbar__left">
				<ons-toolbar-button>
					<ons-icon icon="fa-plus-circle" class=" toolbar-icon"/>
				</ons-toolbar-button>
			</div>
		);
	}

	/**
	 * Callback for when screen is shown
	 *
	 * @return	void
	 */
	onShow = () => {
		setTimeout(client.readyForHCP, 4000);
	}

	/**
	 * Allow subscreens to override the toolbar. Pass this method
	 * as a prop to the tabs found in this.getTabs().
	 * 
	 * Example:
	 * 	let toolbar = (
	 * 		<Toolbar>
	 * 			...
	 * 		</Toolbar>
	 * 	)
	 * 	this.props.setCustomToolbar('Tab 1', toolbar);
	 * 
	 * @param {string} screenTitle 
	 * @param {React.Component} toolbar 
	 */
	setCustomToolbar = ( screenTitle, toolbar ) => {
		let { customToolbar } = this.state;
		customToolbar[screenTitle] = toolbar;

		this.setState({ customToolbar });
	}
    
}
