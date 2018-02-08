import React, {PropTypes, Component} from 'react';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';


class AdminCheckinModal extends Component {
    static displayName = 'AdminCheckinModal';

    render() {
        return (
            <Text>
               HELLO
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonWrapper: {
        flex: 1,
        position: 'relative'
    }
});

export default AdminCheckinModal;
