import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class FirebaseAuthContainer extends Component  {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="firebaseui-auth-container">
                <StyledFirebaseAuth uiConfig={this.props.uiConfig} firebaseAuth={this.props.firebaseAuth}/>
            </div>
        )
    } 
}

export default FirebaseAuthContainer;