import React, { PropTypes, Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    Picker,
    DatePickerAndroid,
    TouchableNativeFeedback,
    ToastAndroid,
    Modal,
    Platform,
    DatePickerIOS,
    ScrollView

} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as WfhState from "./WfhState";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Api from '../../office-server/OfficeApi';
import * as LeaveHistoryState from "../LeavesHistory/LeavesHistoryState"


var mCakeHrId = 0;
var mWfhUsed = 0;
var mWfhAssigned = 0;

const Item = Picker.Item;

class WfhView extends Component {

    //PAGE name
    static displayName = 'WorkFromHome';

    //date picker title 
    static datePickerTitle = 'DatePickerAndroid';

    //required properties of this class
    static propTypes = {
        wfhState: PropTypes.shape({
            showApplyButton: PropTypes.bool.isRequired,
            showProgress: PropTypes.bool.isRequired,
            errorMessage: PropTypes.string.isRequired,
            successMessage: PropTypes.string.isRequired,
            showNumberOfDaysPicker: PropTypes.bool.isRequired,
            showPartOfDayPicker: PropTypes.bool.isRequired,
            fromDateText: PropTypes.string.isRequired,
            toDateText: PropTypes.string.isRequired,
            isSingleDay: PropTypes.bool.isRequired,
            partOfDay: PropTypes.string.isRequired,
            usedLeaves: PropTypes.string.isRequired,
            remainingLeaves: PropTypes.string.isRequired,
            briefMessage: PropTypes.string.isRequired,
            showFromDatePicker: PropTypes.bool.isRequired,
            showToDatePicker: PropTypes.bool.isRequired
        }).isRequired,
        dispatch: PropTypes.func.isRequired,
        pushRoute: PropTypes.func.isRequired

    };


    //this call is called when the class is called for the first time
    componentWillMount() {
        // reset the local state of this view for the first time`
        this.props.dispatch(WfhState.reset());

        Api.getLeavesDetails().then((resp) => {
            mCakeHrId = resp.result.cakeHR.id;
            mWfhUsed = resp.result.cakeHR.custom_types_data['10019'].used;
            mWfhAssigned = resp.result.cakeHR.custom_types_data['10019'].assigned;

            this.props.dispatch(WfhState.updateUsedLeaves(mWfhUsed));
            this.props.dispatch(WfhState.updateRemainingLeaves(mWfhAssigned));
        }).catch((e) => {
            console.log(e);
        });
    }

    //handles the ios and android dependent coded for picker
    rendorHowManyDays = (flexWeight) => {

        let ONE_DAY = "One Day";
        let MULTIPLE_DAYS = "Multiple Days";

        return (
            <View style={{ flex: flexWeight }}>
                <Text style={styles.plainText}>
                    How many Days?
                </Text>


                {/*Android Picker*/}

                {(Platform.OS === 'android') &&
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.SelectableBackground()}
                        underlayColor="transparent">

                        <View style={styles.basicPickerButton}>

                            <Picker
                                selectedValue={this.props.wfhState.isSingleDay ? "One Day" : "Multiple Days"}
                                onValueChange={(days) => this.props.dispatch(WfhState.updateNumberOfDays(days))}
                                mode="dropdown">

                                <Picker.Item label={ONE_DAY} value="One Day" />
                                <Picker.Item label={MULTIPLE_DAYS} value="Multiple Days" />

                            </Picker>
                        </View>
                    </TouchableNativeFeedback>
                }

                {/*IOS Picker*/}

                {(Platform.OS === 'ios') &&
                    <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => this.props.dispatch(WfhState.updateNumberDaysPicker(true))}
                    >
                        <View style={[styles.basicPickerButton, styles.customPickerPadding]}>

                            <Text style={styles.basicText}>
                                {this.props.wfhState.isSingleDay ? "One Day" : "Multiple Days"}
                            </Text>
                            <Modal
                                animationType={"none"}
                                transparent={true}
                                visible={this.props.wfhState.showNumberOfDaysPicker}
                                onRequestClose={() => { this.props.dispatch(WfhState.updateNumberDaysPicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(WfhState.updateNumberDaysPicker(false));
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <Picker
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    selectedValue={this.props.wfhState.isSingleDay ? "One Day" : "Multiple Days"}
                                    onValueChange={(days) => {
                                        this.props.dispatch(WfhState.updateNumberOfDays(days));
                                    }}>

                                    <Picker.Item label={ONE_DAY} value={"One Day"} />
                                    <Picker.Item label={MULTIPLE_DAYS} value={"Multiple Days"} />

                                </Picker>

                            </Modal>
                        </View>
                    </TouchableHighlight>
                }

            </View>
        );
    }

    rendorHalfOrFullDay = (flexWeight) => {

        if (!this.props.wfhState.isSingleDay) {
            return;
        }

        let FULL_DAY = "Full Day";
        let FIRST_HALF = "First Half";
        let SECOND_HALF = "Second Half";

        return (
            <View style={{ flex: flexWeight }}>

                <Text style={styles.plainText}>
                    Half or Full day?
            </Text>

                {/*Android Picker*/}
                {(Platform.OS === 'android') &&
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.SelectableBackground()}
                        underlayColor="transparent">

                        <View style={styles.basicPickerButton}>
                            <Picker
                                selectedValue={this.props.wfhState.partOfDay}
                                onValueChange={(day) => this.props.dispatch(WfhState.updatePartOfDay(day))}
                                mode="dropdown">
                                <Picker.Item label={FULL_DAY} value={FULL_DAY} />
                                <Picker.Item label={FIRST_HALF} value={FIRST_HALF} />
                                <Picker.Item label={SECOND_HALF} value={SECOND_HALF} />

                            </Picker>
                        </View>

                    </TouchableNativeFeedback>
                }

                {/*IOS Picker*/}
                {(Platform.OS === 'ios') &&
                    <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => this.props.dispatch(WfhState.updatePartOfDayPicker(true))}>
                        <View style={[styles.basicPickerButton, styles.customPickerPadding]}>

                            <Text style={styles.basicText}>
                                {this.props.wfhState.partOfDay}
                            </Text>
                            <Modal
                                animationType={"none"}
                                transparent={true}
                                visible={this.props.wfhState.showPartOfDayPicker}
                                onRequestClose={() => { this.props.dispatch(WfhState.updatePartOfDayPicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(WfhState.updatePartOfDayPicker(false));
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <Picker
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    selectedValue={this.props.wfhState.partOfDay}
                                    onValueChange={(day) => {
                                        this.props.dispatch(WfhState.updatePartOfDay(day))
                                    }}>
                                    <Picker.Item label={FULL_DAY} value={FULL_DAY} />
                                    <Picker.Item label={FIRST_HALF} value={FIRST_HALF} />
                                    <Picker.Item label={SECOND_HALF} value={SECOND_HALF} />
                                </Picker>

                            </Modal>
                        </View>
                    </TouchableHighlight>
                }
            </View>
        );

    }

    rendorSelectDate = (flexWeight) => {

        return (
            <View style={{ flex: flexWeight }}>

                <Text style={styles.plainText}>
                    Select Date for WFH
                </Text>

                <View style={{ flexDirection: 'row' }}>

                    {/*Android Picker From Date*/}
                    {(Platform.OS === 'android') &&
                        <TouchableNativeFeedback
                            title="DatePickerAndroid"
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={this.showFromPicker.bind(this, this.props.wfhState.fromDate)}
                            underlayColor="transparent">


                            <View
                                style={styles.basicCalenderView}>
                                <Text style={styles.basicText}>{this.props.wfhState.fromDateText}</Text>
                                <Icon
                                    size={20}
                                    color='#000'
                                    name="calendar"
                                    style={{ backgroundColor: "transparent" }}
                                />
                            </View>

                        </TouchableNativeFeedback>
                    }

                    {/*IOS Picker From Date*/}

                    {(Platform.OS === 'ios') &&
                        <View style={{ flex: 1 }}>
                            <TouchableHighlight
                                onPress={() => this.props.dispatch(WfhState.updateFromDatePicker(true))}
                                underlayColor="transparent">


                                <View
                                    style={[styles.basicCalenderView]}>
                                    <Text style={[styles.basicText]}>{this.props.wfhState.fromDateText}</Text>
                                    <Icon
                                        size={20}
                                        color='#000'
                                        name="calendar"
                                        style={{ backgroundColor: "transparent" }}
                                    />
                                </View>
                            </TouchableHighlight>


                            <Modal
                                animationType={"none"}
                                transparent={true}
                                visible={this.props.wfhState.showFromDatePicker}
                                onRequestClose={() => { this.props.dispatch(WfhState.updateFromDatePicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(WfhState.updateFromDatePicker(false));
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <DatePickerIOS
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    date={typeof (this.props.wfhState.fromDate) === 'string' ? new Date() : this.props.wfhState.fromDate}
                                    mode="date"
                                    onDateChange={(date) => {
                                        this.props.dispatch(WfhState.updateFromDate(date))
                                    }}
                                />

                            </Modal>
                        </View>
                    }

                    {/*Android Picker To Date*/}
                    {!this.props.wfhState.isSingleDay && (Platform.OS === 'android') &&
                        <TouchableNativeFeedback
                            title="DatePickerAndroid"
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={this.showToPicker.bind(this, this.props.wfhState.toDate)}
                            underlayColor="transparent">
                            <View
                                style={styles.basicCalenderView}>
                                <Text style={styles.basicText}> {this.props.wfhState.toDateText} </Text>
                                <Icon
                                    size={20}
                                    color='#000'
                                    name="calendar"
                                    style={{ alignSelf: "center", backgroundColor: "transparent" }}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    }


                    {/*IOS Picker To Date*/}

                    {!this.props.wfhState.isSingleDay && (Platform.OS === 'ios') &&
                        <View style={{ flex: 1 }}>
                            <TouchableHighlight
                                onPress={() => this.props.dispatch(WfhState.updateToDatePicker(true))}
                                underlayColor="transparent">
                                <View
                                    style={styles.basicCalenderView}>
                                    <Text style={styles.basicText}> {this.props.wfhState.toDateText} </Text>

                                    <Icon
                                        size={20}
                                        color='#000'
                                        name="calendar"
                                        style={{ alignSelf: "center", backgroundColor: "transparent" }}
                                    />
                                </View>
                            </TouchableHighlight>
                            <Modal
                                animationType={"none"}
                                transparent={true}
                                visible={this.props.wfhState.showToDatePicker}
                                onRequestClose={() => { this.props.dispatch(WfhState.updateToDatePicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(WfhState.updateToDatePicker(false));
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <DatePickerIOS
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    date={typeof (this.props.wfhState.toDate) === 'string' ? new Date() : this.props.wfhState.toDate}
                                    minimumDate= {typeof(this.props.wfhState.fromDate) === 'string'? new Date():this.props.wfhState.fromDate}
                                    mode="date"
                                    onDateChange={(date) => {
                                        this.props.dispatch(WfhState.updateToDate(date))
                                    }}
                                />

                            </Modal>
                        </View>
                    }


                </View>
            </View>
        );
    }


    rendorMessageBox = (flexWeight) => {
        return (
            <View style={{ flex: flexWeight }}>
                <Text style={styles.plainText}>
                    Brief reason
                </Text>
                <Kohana
                    style={{ backgroundColor: '#d7d7d7', maxHeight: 50 }}
                    label={'Comment'}
                    iconClass={Icon}
                    iconName={'commenting'}
                    iconColor={'black'}
                    labelStyle={{ color: '#000000', fontSize: 16, fontWeight: 'normal' }}
                    inputStyle={{ color: '#000000' }}
                    onChangeText={(message) => this.props.dispatch(WfhState.updateBriefMessage(message))}
                />
            </View>

        );
    }

    rendorApplyButton = (flexWeight) => {

        return (
            <View style={{ flex: flexWeight }}>
                <View style={{ marginTop: 30 }}>

                    {Platform.OS === 'android' && this.props.wfhState.showApplyButton &&
                        <Button
                            onPress={() => {
                                this.applyForWorkFromHome();
                            }}
                            color='#464763'
                            title="Apply work from home" />
                    }

                    {Platform.OS === 'ios' && this.props.wfhState.showApplyButton &&
                        <View style={{ backgroundColor: '#464763' }}>
                            <Button
                                onPress={() => {
                                    this.applyForWorkFromHome();
                                }}
                                color='#ffffff'
                                title="Apply work from home" />
                        </View>
                    }

                    {this.props.wfhState.showProgress &&
                        <ActivityIndicator
                            size="large"
                            color="white"
                        />
                    }
                </View>
            </View>
        );
    }

    rendorProgressStatus = (flexWeight) => {

        return (
            <View style={{
                marginTop: 50,
                marginBottom: 50,
                flex: flexWeight, alignSelf: 'center'
            }}>

                <AnimatedCircularProgress
                    size={200}
                    width={3}
                    fill={this.props.wfhState.usedLeaves / this.props.wfhState.remainingLeaves * 100}
                    tintColor="#af00d8"
                    backgroundColor="#00D5D5">
                    {
                        (fill) => (
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ flex: 1, fontSize: 28, color: 'white', textAlign: 'center', marginTop: -140 }}>
                                    {this.props.wfhState.usedLeaves}
                                </Text>

                                <Text style={{ flex: 0.2, fontSize: 12, textAlign: 'center', color: 'white', opacity: 0.5, marginTop: -300 }}>
                                    {this.props.wfhState.remainingLeaves - this.props.wfhState.usedLeaves} Work From Home {'\n'} Remaining
                                </Text>

                            </View>
                        )
                    }
                </AnimatedCircularProgress>
            </View>
        );
    }

    renderWFHHistory = (flexWeight) => {
         return (
        <View style={{ marginTop: 15 ,
                 marginBottom: 50,
                flex: flexWeight}}>
            {Platform.OS === 'android' &&
                <Button
                    onPress={() => {
                        this.showHistoryScreen();
                    }}
                    color='#464763'
                    title="Work from home history" />
            }

            {Platform.OS === 'ios' &&
                <View style={{ backgroundColor: '#464763' }}>
                    <Button
                        onPress={() => {
                            this.showHistoryScreen();
                        }}
                        color='#ffffff'
                        title="Work from home history" />
                </View>
            }
        </View>
         )
    }



    render() {

        return (

            <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                locations={[0.0, 0.5, 1.0]}
                colors={['#60639f', '#5e73a1', '#5b87a3']} style={styles.linearGradient}>

                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    style={styles.scrollView}>

                    {this.rendorHowManyDays(1)}

                    {this.rendorHalfOrFullDay(1)}

                    {this.rendorSelectDate(1)}

                    {this.rendorMessageBox(1)}

                    {this.rendorApplyButton(1)}

                    {this.rendorProgressStatus(2)}

                    {this.renderWFHHistory(1)}

                </ScrollView>

            </LinearGradient>
        );
    }

    /**Show Android From Date Picker */
    showFromPicker = async (options) => {
        console.log(options);
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: typeof (this.props.wfhState.fromDate) === 'string' ? new Date() : this.props.wfhState.fromDate
            });
            if (action === DatePickerAndroid.dismissedAction) {
                //this.props.dispatch(WfhState.updateFromDate());
            } else {
                console.log(date);
                var date = new Date(year, month, day);
                this.props.dispatch(WfhState.updateFromDate(date));
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    /**Show Android To Date Picker */
    showToPicker = async (options) => {

        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                minDate: typeof(this.props.wfhState.fromDate) === 'string'? new Date():this.props.wfhState.fromDate,
                date: typeof (this.props.wfhState.toDate) === 'string' ? new Date() : this.props.wfhState.toDate
            });
            if (action === DatePickerAndroid.dismissedAction) {
                //this.props.dispatch(WfhState.updateDate());
            } else {
                console.log(date);
                var date = new Date(year, month, day);
                this.props.dispatch(WfhState.updateToDate(date));
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    /*
    * showing work from home history screen
    */
    showHistoryScreen = () => {
        //alert("history screen shown")
        this.props.pushRoute({key: 'LeavesHistoryTab', title: 'Work From Home history'});
        this.props.dispatch(LeaveHistoryState.setLeaveHistoryType("Work from home"));
    }

    /**
     * Api call for applying work for home
     */
    applyForWorkFromHome = () => {


        this.props.dispatch(WfhState.showApplyButton(false));
        this.props.dispatch(WfhState.toggleProgress(true));


        Api.getLeavesDetails().then((resp) => {
            console.log(resp);
            cakeHrId = resp.result.cakeHR.id;
            wfhUsed = resp.result.cakeHR.custom_types_data['10019'].used;
            wfhAssigned = resp.result.cakeHR.custom_types_data['10019'].assigned;
            console.log("Cake hr " + cakeHrId);

            this.props.dispatch(WfhState.updateUsedLeaves(wfhUsed));
            this.props.dispatch(WfhState.updateRemainingLeaves(wfhAssigned));

            let toDate = this.props.wfhState.toDate;

            if (this.props.wfhState.isSingleDay == true) {
                toDate = this.props.wfhState.fromDate;
            }

            Api.applyforWfh(cakeHrId, this.props.wfhState.fromDate, toDate, this.props.wfhState.partOfDay, this.props.wfhState.briefMessage).then(
                (resp) => {
                    console.log(resp);
                    if (resp.result.error) {
                        alert(resp.result.error);
                        //ToastAndroid.showWithGravity(resp.result.error, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        //this.props.dispatch(WfhState.showError(resp.result.error));         
                    } else {
                        alert(resp.result.success);
                        //ToastAndroid.showWithGravity(resp.result.success, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        //this.props.dispatch(WfhState.showSuccess(resp.result.success));
                        //if success reset the state
                        this.props.dispatch(WfhState.reset());
                    }
                    this.props.dispatch(WfhState.showApplyButton(true));
                    this.props.dispatch(WfhState.toggleProgress(false));
                }
            ).catch((e) => {
                alert("There was some error, check your internet connection");
                //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                //this.props.dispatch(WfhState.showError(e));         
                this.props.dispatch(WfhState.showApplyButton(true));
                this.props.dispatch(WfhState.toggleProgress(false));
            });
        }).catch((e) => {
            alert("There was some error, check your internet connection");
            //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            //this.props.dispatch(WfhState.showError(e));         
            this.props.dispatch(WfhState.showApplyButton(true));
            this.props.dispatch(WfhState.toggleProgress(false));
            console.log(e);
        });

    };

}



const styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        flexDirection: 'column',
    },

    plainText: {
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 15,
        color: '#fff'

    },

    basicPickerButton: {
        backgroundColor: '#d7d7d7',
        paddingLeft: 5,
        marginBottom: 10
    },

    customPickerPadding: {
        paddingTop: 12,
        paddingBottom: 12
    },

    basicText: {
        flex: 1,
        backgroundColor: "transparent",
        paddingLeft: 5,
        textAlign: 'left', color: "#000000", fontSize: 16,
    },

    basicCalenderView: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        backgroundColor: '#d7d7d7',
        marginBottom: 10,
        marginRight: 10,
        justifyContent: 'flex-end'
    },
    scrollView: {
        backgroundColor: 'transparent',
        height: 800,
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15
    }
});

export default WfhView;