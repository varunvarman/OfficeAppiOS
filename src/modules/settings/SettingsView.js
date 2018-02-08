'use_strict';

import React, { PropTypes, Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    Platform,
    Dimensions,
    AppRegistry,
    DatePickerIOS,
    TimePickerAndroid,
    TouchableHighlight,
    Modal,
    Button,
    ActivityIndicator,
    Alert,
    Keyboard
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RealmDatabse from '../../database/RealmDatabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import * as SettingsState from './SettingsState';
import * as OfficeAPIs from '../../office-server/OfficeApi';
import * as notification from '../../utils/notification';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var isModalVisible = false;
var isKeyboardVisible = false;
var keyBoardDidShowListner = null;
var keyBoardDidHideListner = null;
var keyBoardDidChangeFrameListner = null;
var supplymentryHeight = 0;

class SettingsView extends Component {

    static displayName = 'SettingsView';

    constructor() {
        super();
        // constructor called in initialization of this screen.
    }

    static propTypes = {
        settingsState: PropTypes.shape({
            showPicker: PropTypes.bool.isRequired,
            officeLocation: PropTypes.shape({
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired
            }).isRequired,
            activityIndicatorAnimating: PropTypes.bool.isRequired,
            keyboardVisible: PropTypes.bool.isRequired
        }).isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        // called when the component is mounted
        this.props.dispatch(SettingsState.toggleKeyboardVisibility(isKeyboardVisible));
        keyBoardDidShowListner = Keyboard.addListener('keyboardDidShow', this.keyBoardDidShow);
        keyBoardDidHideListner = Keyboard.addListener('keyboardDidHide', this.keyBoardDidHide);
        this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
        OfficeAPIs.fetchOfficeLocationAPI().then((response) => {
            //console.log('RESPONSE API: ' + JSON.stringify(response.results[0]));
            this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
            if (typeof response != 'undefined') {
                this.props.dispatch(SettingsState.updateOfficeLocationLatitude(Number(response.results[0].latitude)));
                this.props.dispatch(SettingsState.updateOfficeLocationLongitude(Number(response.results[0].longitude)));
                let userObj = RealmDatabse.findUser()[0];
                let newObject = {
                    ...userObj,
                    officaLocationID: response.results[0].id
                };
                RealmDatabse.saveUser(newObject);
                OfficeAPIs.setUserName(newObject);
            } else {
                this.props.dispatch(SettingsState.updateOfficeLocationLatitude(this.props.settingsState.officeLocation.latitude));
                this.props.dispatch(SettingsState.updateOfficeLocationLongitude(this.props.settingsState.officeLocation.longitude));
            }
        }).catch((error) => {
            this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
            this.props.dispatch(SettingsState.updateOfficeLocationLatitude(this.props.settingsState.officeLocation.latitude));
            this.props.dispatch(SettingsState.updateOfficeLocationLongitude(this.props.settingsState.officeLocation.longitude));
        });
    }

    componentWillUnmount() {
        keyBoardDidShowListner.remove();
        keyBoardDidHideListner.remove();
    }

    render() {
        //console.log('PROPS: ' + JSON.stringify(this.props) + ' TIME: ' + JSON.stringify((new Date((new Date().getFullYear()), (new Date().getMonth()), (new Date().getDate()), 0, 0, 0, 0))));
        let dateToDisplay = new Date(this.props.settingsState.time);
        let userRole = (RealmDatabse.findUser()[0]).role;
        return (
            <LinearGradient
                style={styles.linearGradient}
                colors={['#48E2FF', '#508FF5', '#5933EA']}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                locations={[0.0, 0.5, 1.0]}>
                <View style={styles.center}>
                    <ScrollView ref={'scrollView'} style={styles.scrollView}
                        automaticallyAdjustContentInsets={false} horizontal={false}
                        contentContainerStyle={styles.scrollviewContentContainerStyle}
                        contentInset={{ top: 0, left: 0, bottom: supplymentryHeight, right: 0 }}>
                        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'flex-start', width: Dimensions.get('window').width }}>
                            {
                                !this.props.settingsState.keyboardVisible && <View>
                                    <Text style={styles.headingText}>
                                        Settings
                            </Text>
                                    <Text style={styles.subHeadingText}>
                                        Checkin Notification Alert Time:
                            </Text>
                                    <View style={{ height: 50, marginLeft: 16, marginRight: 16, backgroundColor: '#d3d3d3', alignItems: 'flex-start', width: (Dimensions.get('window').width - 32), borderRadius: 4, marginBottom: 8 }}>
                                        <TouchableHighlight style={{ flex: 1, width: (Dimensions.get('window').width - 32), borderRadius: 4 }} underlayColor='#d3d3d3' activeOpacity={0.7} onPress={() => { Platform.OS === 'ios' ? this.props.dispatch(SettingsState.showPickerView(!this.props.settingsState.showPicker)) : this.showAndroidPicker() }}>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center' }}>
                                                <Icon size={26} color='#000000' name={"clock-o"} style={styles.iconStyle} />
                                                <Text style={styles.textInput_TextStyle}>{this.formatDate(dateToDisplay)}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>}

                            <Text style={styles.subHeadingText}>
                                Office Location:
                            </Text>
                            <View style={{ marginLeft: 16, marginRight: 16, backgroundColor: '#d3d3d3', alignItems: 'flex-start', width: (Dimensions.get('window').width - 32), borderRadius: 4, marginBottom: 8 }}>
                                <ActivityIndicator style={styles.activityIndicatorStyle} hidesWhenStopped={true} animating={this.props.settingsState.activityIndicatorAnimating} size={'large'} color={'white'} />
                                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'flex-start', height: 50, justifyContent: 'center' }}>
                                    <Icon size={26} color='#000000' name={"map-marker"} style={styles.iconStyle} />
                                    <Text style={styles.labelTextStyle}>{'Co-ordinates'}</Text>
                                </View>
                                <View style={{ backgroundColor: 'transparent', width: (Dimensions.get('window').width - 52), alignItems: 'center', marginLeft: 8, marginRight: 8, marginBottom: 4 }} pointerEvents={userRole !== 'user' && this.props.settingsState.activityIndicatorAnimating === false ? 'auto' : 'auto'}>
                                    <Fumi ref={'latitude'}
                                        style={{ backgroundColor: 'transparent', height: 50, width: (Dimensions.get('window').width - 52) }} label={'Latitude'}
                                        value={this.props.settingsState.officeLocation.latitude.toString()} labelStyle={{
                                            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
                                            fontSize: 14, color: '#000000', fontWeight: 'normal'
                                        }} iconClass={Icon} iconName={'globe'} iconColor={'#000000'} keyboardType={'numeric'}
                                        returnKeyType={'done'}
                                        onChangeText={(latitude) => { this.props.dispatch(SettingsState.updateOfficeLocationLatitude(Number(latitude))) }}
                                    />

                                    <Fumi ref={'longitude'}
                                        style={{ backgroundColor: 'transparent', height: 50, width: (Dimensions.get('window').width - 52) }}
                                        label={'Longitude'} value={this.props.settingsState.officeLocation.longitude.toString()}
                                        labelStyle={{ fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto', fontSize: 14, color: '#000000', fontWeight: 'normal' }}
                                        iconClass={Icon} iconName={'globe'} iconColor={'#000000'} keyboardType={'numeric'} returnKeyType={'done'}
                                        onChangeText={(longitude) => { this.props.dispatch(SettingsState.updateOfficeLocationLongitude(Number(longitude))) }}
                                    />

                                </View>
                                {this.DisplaySaveButton(userRole)}
                            </View>
                            <Modal animationType={'slide'} visible={Platform.OS === 'ios' ? this.props.settingsState.showPicker : false} transparent={true} onRequestClose={() => { console.log('DID CLOSE MODAL BY CLICKING DONE') }}>
                                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                                </View>
                                <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', height: 40, justifyContent: 'center' }}>
                                    <View style={{ backgroundColor: 'transparent', borderRadius: 2 }}>
                                        <Button title={'Done'} accessibilityLabel={'Finish selection of time.'} color={'#000080'} onPress={() => { this.props.dispatch(SettingsState.showPickerView(!this.props.settingsState.showPicker)) }} />
                                    </View>
                                </View>
                                <DatePickerIOS style={{ backgroundColor: '#d7d7d7' }} date={dateToDisplay} mode={'time'} onDateChange={(date) => { this.updateTime(date) }} />
                            </Modal>
                        </View>
                    </ScrollView>
                </View>
            </ LinearGradient>
        );
    }

    updateOfficeCoordinates() {
        let ordinates = {
            latitude: this.props.settingsState.officeLocation.latitude,
            longitude: this.props.settingsState.officeLocation.longitude
        }
        this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
        OfficeAPIs.updateNewOfficeLocation(ordinates).then((response) => {
            this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
            Alert.alert(
                'Location Updated',
                'The new office location has been updated.',
                [
                    { text: 'OK', onPress: () => { } }
                ],
                { cancelable: false }
            )
        }).catch((error) => {
            this.props.dispatch(SettingsState.toggleActivityIndicator(!this.props.settingsState.activityIndicatorAnimating));
            Alert.alert(
                'Location Error',
                'The new office location could not be updated try again later.',
                [
                    { text: 'OK', onPress: () => { } }
                ],
                { cancelable: false }
            )
        })
    }

    updateTime(time) {
        this.props.dispatch(SettingsState.updateDateTime(time));
        console.log("time ios is hours ", time.getHours(), "minutes ", time.getMinutes());
        notification.setCheckinNotification(Platform.OS, time.getHours(), time.getMinutes(), true);
    }

    showAndroidPicker = async (options) => {
        let date = new Date(this.props.settingsState.time);
        this.props.dispatch(SettingsState.showPickerView(!this.props.settingsState.showPicker));
        const { action, hour, minute } = await TimePickerAndroid.open({
            hour: date.getHours(),
            minute: date.getMinutes(),
            is24Hour: false,
        });
        if (action === TimePickerAndroid.timeSetAction) {
            var updatedDate = new Date();
            updatedDate.setHours(hour);
            updatedDate.setMinutes(minute);
            console.log("time andoid is", hour, " ", minute);
            notification.setCheckinNotification(Platform.OS, hour, minute, true);
            this.props.dispatch(SettingsState.updateDateTime(updatedDate));
        } else {
            this.props.dispatch(SettingsState.showPickerView(!this.props.settingsState.showPicker));
        }
    }

    DisplaySaveButton = (params) => {
        //console.log('PARAMs: '+ JSON.stringify(params))
        if (params !== 'user') {
            return (
                <View style={{ backgroundColor: 'transparent', flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.smallText}>
                            The entered data will not be updated, on server until you press save.
                    </Text>
                    </ View>
                    <View style={{ backgroundColor: 'transparent', borderRadius: 2 }}>
                        <Button title={'Save'} accessibilityLabel={'Save specified office location.'} color={'#000080'} onPress={() => { this.updateOfficeCoordinates() }} />
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    keyBoardDidShow = (options) => {
        if (!isKeyboardVisible) {

            isKeyboardVisible = true;

            if (Platform.OS === 'ios') {
                //console.log('KEYBOARD DID SHOW: ' + JSON.stringify(options.endCoordinates.height));
                supplymentryHeight += options.endCoordinates.height;
            }

            alert('Keyboard  vis ' + isKeyboardVisible)

            this.props.dispatch(SettingsState.toggleKeyboardVisibility(isKeyboardVisible));
            //console.log('KEYBOARD DID HIDE: SUPPLYMENTRY HEIGHT: ' + JSON.stringify(supplymentryHeight));
        }
    }

    keyBoardDidHide = (options) => {
        if (isKeyboardVisible) {

            isKeyboardVisible = false;

            if (Platform.OS === 'ios') {
                //console.log('KEYBOARD DID HIDE: ' + JSON.stringify(options.endCoordinates.height));
                supplymentryHeight -= options.endCoordinates.height;
            }

            alert('Keyboard  vis ' + isKeyboardVisible)
            this.props.dispatch(SettingsState.toggleKeyboardVisibility(isKeyboardVisible));
            //console.log('KEYBOARD DID HIDE: SUPPLYMENTRY HEIGHT: ' + JSON.stringify(supplymentryHeight));
        }
    }

    formatDate = (date) => {
        var d = new Date(date);
        var hh = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        /* if you want 2 digit hours:
        h = h<10?"0"+h:h; */
        var replacement = h + ":" + m;
        /* if you want to add seconds
        replacement += ":"+s;  */
        replacement += " " + dd;
        return replacement
    }

    textFieldWasFocussed(refName) {
        if (Platform.OS === 'Android') {
            setTimeout(() => {
                let scrollResponder = this.refs.scrollView.getScrollResponder();
                scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                    React.findNodeHandle(this.refs[refName]),
                    216,
                    true
                );
            }, 50);
        }
    }
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    test: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    linearGradient: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    scrollView: {
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width
    },
    scrollviewContentContainerStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    headingText: {
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        textAlign: 'left',
        color: '#ffffff',
        fontSize: 28,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
        textDecorationLine: 'underline'
    },
    subHeadingText: {
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        textAlign: 'left',
        color: '#ffffff',
        fontSize: 18,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
    },
    textInput_TextStyle: {
        marginTop: 2,
        marginBottom: 2,
        marginRight: 4,
        marginLeft: 4,
        textAlign: 'left',
        color: '#000000',
        fontSize: 16,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
    },
    iconStyle: {
        alignSelf: "center",
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 16,
        marginRight: 8,
        backgroundColor: 'transparent'
    },
    labelTextStyle: {
        marginTop: 14,
        textAlign: 'center',
        color: '#000000',
        fontSize: 16,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
    },
    activityIndicatorStyle: {
        position: 'absolute',
        left: (Dimensions.get('window').width - 32) / 2 - 15,
        top: 77 - 15
    },
    smallText: {
        marginLeft: 8,
        marginBottom: 8,
        textAlign: 'left',
        color: '#000000',
        fontSize: 10,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto'
    }
});

export default SettingsView;