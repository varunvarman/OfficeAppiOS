'use strict';

import React, { PropTypes, Component } from 'react';
import {
    Image,
    Text,
    View,
    ActivityIndicator,
    StyleSheet, 
    Platform,
    Dimensions,
    ScrollView
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RealmDatabse from '../../database/RealmDatabase';

const devReady = 'DEV READY';
const inProgress = 'IN PROGRESS';
const completed = 'COMPLETED';
const monthlyHours = 160;

class ProfileView extends Component {

    static displayName = 'ProfileView'

    // specified prop(s) are not in use as of now!!
    static propTypes = {
        // username: PropTypes.string.isRequired,
        // description: PropTypes.string.isRequired,
        // hours: PropTypes.number.isRequired,
        // projects: PropTypes.shape({
        //     devReady: PropTypes.number.isRequired,
        //     inProgress: PropTypes.number.isRequired,
        //     completed: PropTypes.number.isRequired
        // }).isRequired
    };

    constructor() {
        super();
    }

    render() {
        let userObj = RealmDatabse.findUser()[0];
        return (
            <View style={styles.baseContainer}>
                {/*<ScrollView style={styles.scrollView} automaticallyAdjustContentInsets={false} horizontal={false} bounces={false} contentContainerStyle={styles.scrollviewContentContainerStyle}>*/}
                    <LinearGradient
                        start={{x: 0.0, y: 0.0}}
                        end={{x: 1.0, y: 1.0}}
                        style={styles.linearGradientShadow} 
                        colors={['#48E2FF', '#508FF5', '#5933EA']} 
                        locations={[0.0, 0.5, 1.0]}>
                            <View style={styles.topContainer}>
                                <Image style={ styles.image } source={{ uri: userObj.image_link }}/>
                                <Text style={styles.headingText}>{userObj.name}</ Text>
                                <Text style={styles.descriptionText}>{userObj.email}</ Text>
                            </ View>
                        </LinearGradient>

                        {/*<LinearGradient
                        start={{x: 0.0, y: 0.0}}
                        end={{x: 1.0, y: 1.0}}
                        style={styles.linearGradient} 
                        colors={['#48E2FF', '#508FF5', '#5933EA']} 
                        locations={[0.0, 0.5, 1.0]}>
                            <View style={styles.bottomContainer}>
                                <View style={styles.rowContainer}>
                                        <View style={styles.holderContainer}>
                                            <Icon size={15} color='#ff1493' name={"circle-o"} style={styles.iconStyle} />
                                            <Text style={styles.baseText}>{0}</Text>
                                            <Text style={styles.baseText}>{devReady}</Text>
                                        </View>
                                        <View style={styles.holderContainer}>
                                            <Icon size={15} color='#ff8c00' name={"circle-o"} style={styles.iconStyle} />
                                            <Text style={styles.baseText}>{0}</Text>
                                            <Text style={styles.baseText}>{inProgress}</Text>
                                        </View>
                                        <View style={styles.holderContainer}>
                                            <Icon size={15} color='#008000' name={"circle-o"} style={styles.iconStyle} />
                                            <Text style={styles.baseText}>{0}</Text>
                                            <Text style={styles.baseText}>{completed}</Text>
                                        </View>
                                </View>
                                <View style={styles.baseContainer}> 
                                    <AnimatedCircularProgress
                                        style={{marginTop:20, alignItems:'center'}}
                                        size={200}
                                        width={4}
                                        fill={80}
                                        tintColor="#00e0ff"
                                        backgroundColor="#3d5875">
                                        {
                                            () => (
                                            <Text style={styles.progressIndicatorText}>
                                                80%
                                            </Text>
                                            )
                                        }
                                    </ AnimatedCircularProgress>
                                </View>
                            </ View>
                        </LinearGradient>*/}
                    {/*</ ScrollView>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
        image: {
            height: 100,
            width: 100,
            borderRadius: 100/2,
            marginTop: 20,
            backgroundColor: 'transparent'
        },
        standardContainer: {
            flex: 1,
            backgroundColor: '#000000',
            alignItems: 'center'
        },
        baseContainer: {
            flex: 1,
            backgroundColor: 'transparent'
        },
        topContainer: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'transparent'
        },
        bottomContainer: {
            flex: 2,
            backgroundColor: 'transparent',
            flexDirection: 'column'
        },
        rowContainer: {
            flexDirection: 'row',
            marginTop: 15, 
            justifyContent: 'space-between',
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 16
        },
        gradient: {
            paddingLeft: 10,
            paddingRight: 10,
        },
        headingText: {
            marginTop: 15,
            textAlign: 'center',
            color: '#ffffff',
            fontSize: 24,
            backgroundColor:"transparent",
            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
        },
        descriptionText: {
            marginBottom: 15,
            textAlign: 'center',
            color: '#ffffff',
            fontSize: 16,
            backgroundColor:"transparent",
            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
        },
        linearGradient: {
            flex: 1,
            elevation: 5,
            backgroundColor: "transparent"
        },
        linearGradientShadow: {
            height: 200,
            elevation: 5,
            shadowColor: '#000000',
            shadowOffset: {
                width: 10,
                height: 0
            },
            shadowOpacity: 0.7,
            backgroundColor: 'transparent',
            flex: 1
        },
        iconStyle: {
            alignSelf:"center",
            marginTop:5,
            marginBottom: 10,
            backgroundColor: 'transparent'
        },
        textPoints: {
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 26
        },
        baseText: {
            textAlign: 'center',
            color: '#ffffff',
            fontSize: 14,
            backgroundColor:"transparent",
            marginBottom: 4,
            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
        },
        holderContainer: {
            backgroundColor: 'transparent',
            alignItems: 'center'
        },
        progressIndicatorText: {
            marginTop: -120,
            textAlign: 'center',
            color: '#ffffff',
            fontSize: 32,
            backgroundColor:"transparent",
            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
            alignSelf: 'center'
        },
        scrollView: {
            backgroundColor: 'transparent',
            width: Dimensions.get('window').width
        },
        scrollviewContentContainerStyle:{
            flex: 1,
            backgroundColor: 'transparent'
        }
    });

    export default ProfileView;