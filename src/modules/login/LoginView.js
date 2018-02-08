'use strict';

import React, {PropTypes, Component} from 'react';
import {View, StyleSheet,Text,NavigationExperimental} from 'react-native';
import * as LoginStates from './LoginState';
import SlackLoginView from '../splash/SlackLoginView';


class LoginView extends Component {

    static displayName = 'LoginView';

    static propTypes = {
        showProgress: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string.isRequired,
        successMessage: PropTypes.string.isRequired,
        showLoginButton: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={styles.container}>
                <SlackLoginView
                    errorMessage = {this.props.errorMessage}
                    successMessage = {this.props.successMessage}
                    showLoginButton = {this.props.showLoginButton}
                    showProgress = {this.props.showProgress}
                    dispatcher = {this.props.dispatch}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#81c04d',
        flexDirection: 'column'    //Step 1
    },
    sceneContainer: {
        flex: 1
    }
});

export default LoginView;
