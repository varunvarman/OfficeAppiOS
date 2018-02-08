import React, { PropTypes, Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
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
import * as LeavesState from "./LeavesState";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Api from '../../office-server/OfficeApi';
import * as LeaveHistoryState from "../LeavesHistory/LeavesHistoryState"

var mCakeHrIdPaid = 0;
var mCakeHrIdUnPaid = 0;
var mLeavesUsed = 0;
var mLeavesAssigned = 0;

class LeavesView extends Component {

    //PAGE name
    static displayName = 'Apply Leaves';

    //date picker title 
    static datePickerTitle = 'DatePickerAndroid';

    //required properties of this class
    static propTypes = {
        LeavesState: PropTypes.shape({
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
            showToDatePicker: PropTypes.bool.isRequired,
            isPaidLeave: PropTypes.bool.isRequired,
            showPaidUnpaidPicker: PropTypes.bool.isRequired
        }).isRequired,
        dispatch: PropTypes.func.isRequired,
          pushRoute: PropTypes.func.isRequired

    };


    //this call is called when the class is called for the first time
    componentWillMount() {
        // reset the local state of this view for the first time`
        this.props.dispatch(LeavesState.reset());

        Api.getLeavesDetails().then((resp) => {
            mCakeHrIdPaid = resp.result.cakeHR.id;
            mLeavesUsed = resp.result.cakeHR.custom_types_data['9931'].used;
            mLeavesAssigned = resp.result.cakeHR.custom_types_data['9931'].assigned;

            this.props.dispatch(LeavesState.updateUsedLeaves(mLeavesUsed));
            this.props.dispatch(LeavesState.updateRemainingLeaves(mLeavesAssigned));
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
                                selectedValue={this.props.LeavesState.isSingleDay ? "One Day" : "Multiple Days"}
                                onValueChange={(days) => this.props.dispatch(LeavesState.updateNumberOfDays(days))}
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
                        onPress={() => this.props.dispatch(LeavesState.updateNumberDaysPicker(true))}
                    >
                        <View style={[styles.basicPickerButton, styles.customPickerPadding]}>

                            <Text style={styles.basicText}>
                                {this.props.LeavesState.isSingleDay ? "One Day" : "Multiple Days"}
                            </Text>
                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.props.LeavesState.showNumberOfDaysPicker}
                                onRequestClose={() => { this.props.dispatch(LeavesState.updateNumberDaysPicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(LeavesState.updateNumberDaysPicker(false))
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <Picker
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    selectedValue={this.props.LeavesState.isSingleDay ? "One Day" : "Multiple Days"}
                                    onValueChange={(days) => {
                                        this.props.dispatch(LeavesState.updateNumberOfDays(days));
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

        if (!this.props.LeavesState.isSingleDay) {
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
                                selectedValue={this.props.LeavesState.partOfDay}
                                onValueChange={(day) => this.props.dispatch(LeavesState.updatePartOfDay(day))}
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
                        onPress={() => this.props.dispatch(LeavesState.updatePartOfDayPicker(true))}>
                        <View style={[styles.basicPickerButton, styles.customPickerPadding]}>

                            <Text style={styles.basicText}>
                                {this.props.LeavesState.partOfDay}
                            </Text>
                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.props.LeavesState.showPartOfDayPicker}
                                onRequestClose={() => { this.props.dispatch(LeavesState.updatePartOfDayPicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(LeavesState.updatePartOfDayPicker(false))
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <Picker
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    selectedValue={this.props.LeavesState.partOfDay}
                                    onValueChange={(day) => {
                                        this.props.dispatch(LeavesState.updatePartOfDay(day))
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

    rendorPaidOrUnPaid = (flexWeight) => {

        let PAID_LEAVE = "Paid Leave";
        let UNPAID_LEAVE = "Unpaid Leave";

        return (
            <View style={{ flex: flexWeight }}>

                <Text style={styles.plainText}>
                    Paid or Unpaid Leave?
            </Text>

                {/*Android Picker*/}
                {(Platform.OS === 'android') &&
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.SelectableBackground()}
                        underlayColor="transparent">

                        <View style={styles.basicPickerButton}>
                            <Picker
                                selectedValue={this.props.LeavesState.isPaidLeave ? "Paid Leave" : "Unpaid Leave"}
                                onValueChange={(day) => this.props.dispatch(LeavesState.updatePaidUnpaid(day))}
                                mode="dropdown">
                                <Picker.Item label={PAID_LEAVE} value={"Paid Leave"} />
                                <Picker.Item label={UNPAID_LEAVE} value={"Unpaid Leave"} />

                            </Picker>
                        </View>

                    </TouchableNativeFeedback>
                }

                {/*IOS Picker*/}
                {(Platform.OS === 'ios') &&
                    <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => this.props.dispatch(LeavesState.updatePaidUnpaidPicker(true))}>
                        <View style={[styles.basicPickerButton, styles.customPickerPadding]}>

                            <Text style={styles.basicText}>
                                {this.props.LeavesState.isPaidLeave ? "Paid Leave" : "Unpaid Leave"}
                            </Text>
                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.props.LeavesState.showPaidUnpaidPicker}
                                onRequestClose={() => { this.props.dispatch(LeavesState.updatePaidUnpaidPicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(LeavesState.updatePaidUnpaidPicker(false))
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <Picker
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    selectedValue={this.props.LeavesState.isPaidLeave ? "Paid Leave" : "Unpaid Leave"}
                                    onValueChange={(day) => {
                                        this.props.dispatch(LeavesState.updatePaidUnpaid(day))
                                    }}>
                                    <Picker.Item label={PAID_LEAVE} value={"Paid Leave"} />
                                    <Picker.Item label={UNPAID_LEAVE} value={"Unpaid Leave"} />
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
                    Select Date for Leave
                </Text>

                <View style={{ flexDirection: 'row' }}>

                    {/*Android Picker From Date*/}
                    {(Platform.OS === 'android') &&
                        <TouchableNativeFeedback
                            title="DatePickerAndroid"
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={this.showFromPicker.bind(this, this.props.LeavesState.fromDate)}
                            underlayColor="transparent">


                            <View
                                style={styles.basicCalenderView}>
                                <Text style={styles.basicText}>{this.props.LeavesState.fromDateText}</Text>
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
                                onPress={() => this.props.dispatch(LeavesState.updateFromDatePicker(true))}
                                underlayColor="transparent">

                                <View
                                    style={styles.basicCalenderView}>
                                    <Text style={styles.basicText}>{this.props.LeavesState.fromDateText}</Text>
                                    <Icon
                                        size={20}
                                        color='#000'
                                        name="calendar"
                                        style={{ backgroundColor: "transparent" }}
                                    />
                                </View>

                            </TouchableHighlight>
                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.props.LeavesState.showFromDatePicker}
                                onRequestClose={() => { this.props.dispatch(LeavesState.updateFromDatePicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(LeavesState.updateFromDatePicker(false))
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <DatePickerIOS
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    date={typeof (this.props.LeavesState.fromDate) === 'string' ? new Date() : this.props.LeavesState.fromDate}
                                    mode="date"
                                    onDateChange={(date) => {
                                        this.props.dispatch(LeavesState.updateFromDate(date))
                                    }}
                                />

                            </Modal>

                        </View>
                    }


                    {/*Android Picker To Date*/}

                    {!this.props.LeavesState.isSingleDay && (Platform.OS === 'android') &&
                        <TouchableNativeFeedback
                            title="DatePickerAndroid"
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={this.showToPicker.bind(this, this.props.LeavesState.toDate)}
                            underlayColor="transparent">

                            <View
                                style={styles.basicCalenderView}>

                                <Text style={styles.basicText}> {this.props.LeavesState.toDateText} </Text>

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

                    {!this.props.LeavesState.isSingleDay && (Platform.OS === 'ios') &&
                        <View style={{ flex: 1 }}>
                            <TouchableHighlight
                                onPress={() => this.props.dispatch(LeavesState.updateToDatePicker(true))}
                                underlayColor="transparent">


                                <View
                                    style={styles.basicCalenderView}>

                                    <Text style={styles.basicText}> {this.props.LeavesState.toDateText} </Text>

                                    <Icon
                                        size={20}
                                        color='#000'
                                        name="calendar"
                                        style={{ alignSelf: "center", backgroundColor: "transparent" }}
                                    />
                                </View>


                            </TouchableHighlight>

                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.props.LeavesState.showToDatePicker}
                                onRequestClose={() => { this.props.dispatch(LeavesState.updateToDatePicker(false)) }}>

                                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />
                                <View style={{ backgroundColor: '#d7d7d7' }}>
                                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                                        <Button
                                            onPress={() => {
                                                this.props.dispatch(LeavesState.updateToDatePicker(false));
                                            }}
                                            title="Done" />
                                    </View>
                                </View>

                                <DatePickerIOS
                                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                                    date={typeof (this.props.LeavesState.toDate) === 'string' ? new Date() : this.props.LeavesState.toDate}
                                    minimumDate={typeof (this.props.LeavesState.fromDate) === 'string' ? new Date() : this.props.LeavesState.fromDate}
                                    mode="date"
                                    onDateChange={(date) => {
                                        this.props.dispatch(LeavesState.updateToDate(date))
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
                    onChangeText={(message) => this.props.dispatch(LeavesState.updateBriefMessage(message))}
                />
            </View>

        );
    }

    rendorApplyButton = (flexWeight) => {

        return (

            <View style={{ flex: flexWeight }}>
                <View style={{ marginTop: 30 }}>

                    {Platform.OS === 'android' && this.props.LeavesState.showApplyButton &&
                        <Button
                            onPress={() => {
                                this.applyForLeave();
                            }}
                            color='#464763'
                            title="Apply For Leave" />
                    }

                    {Platform.OS === 'ios' && this.props.LeavesState.showApplyButton &&
                        <View style={{ backgroundColor: '#464763' }}>
                            <Button
                                onPress={() => {
                                    this.applyForLeave();
                                }}
                                color='#ffffff'
                                title="Apply For Leave" />
                        </View>
                    }

                    {this.props.LeavesState.showProgress &&
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
                marginBottom: 25,
                flex: flexWeight, alignSelf: 'center'
            }}>

                <AnimatedCircularProgress
                    size={200}
                    width={3}
                    fill={this.props.LeavesState.usedLeaves / this.props.LeavesState.remainingLeaves * 100}
                    tintColor="#af00d8"
                    backgroundColor="#00D5D5">
                    {
                        (fill) => (
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ flex: 1, fontSize: 40, color: 'white', textAlign: 'center', marginTop: -140 }}>
                                    {this.props.LeavesState.usedLeaves}
                                </Text>

                                <Text style={{ flex: 0.2, fontSize: 12, textAlign: 'center', color: 'white', opacity: 0.5, marginTop: -300 }}>
                                    {this.props.LeavesState.remainingLeaves - this.props.LeavesState.usedLeaves} Leaves Remaining
                                </Text>

                            </View>
                        )
                    }
                </AnimatedCircularProgress>
            </View>
        );
    }
    renderLeaveHistory = (flexWeight) => {
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
                    title="Leave History" />
            }

            {Platform.OS === 'ios' &&
                <View style={{ backgroundColor: '#464763' }}>
                    <Button
                        onPress={() => {
                            this.showHistoryScreen();
                        }}
                        color='#ffffff'
                        title="Leave History" />
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

                    {this.rendorPaidOrUnPaid(1)}

                    {this.rendorSelectDate(1)}

                    {this.rendorMessageBox(1)}

                    {this.rendorApplyButton(1)}

                    {this.rendorProgressStatus(2)}

                    {this.renderLeaveHistory(1)}

                </ScrollView>

            </LinearGradient>
        );
    }

    /**Show Android From Date Picker */
    showFromPicker = async (options) => {
        console.log(options);
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: typeof (this.props.LeavesState.fromDate) === 'string' ? new Date() : this.props.LeavesState.fromDate
            });
            if (action === DatePickerAndroid.dismissedAction) {
                //this.props.dispatch(LeavesState.updateFromDate());
            } else {
                console.log(date);
                var date = new Date(year, month, day);
                this.props.dispatch(LeavesState.updateFromDate(date));
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    /**Show Android To Date Picker */
    showToPicker = async (options) => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: typeof (this.props.LeavesState.toDate) === 'string' ? new Date() : this.props.LeavesState.toDate
            });
            if (action === DatePickerAndroid.dismissedAction) {
                //this.props.dispatch(LeavesState.updateDate());
            } else {
                console.log(date);
                var date = new Date(year, month, day);
                this.props.dispatch(LeavesState.updateToDate(date));
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    showHistoryScreen = () => {
        //alert("history screen shown")
        this.props.pushRoute({key: 'LeavesHistoryTab', title: 'Leaves History'});
        this.props.dispatch(LeaveHistoryState.setLeaveHistoryType("Vacation"));
    }

    /**
     * Api call for applying leave
     */
    applyForLeave = () => {


        this.props.dispatch(LeavesState.showApplyButton(false));
        this.props.dispatch(LeavesState.toggleProgress(true));


        Api.getLeavesDetails().then((resp) => {
            console.log(resp);
            mCakeHrIdPaid = resp.result.cakeHR.id;
            mWfhUsed = resp.result.cakeHR.custom_types_data['9931'].used;
            mWfhAssigned = resp.result.cakeHR.custom_types_data['9931'].assigned;

            this.props.dispatch(LeavesState.updateUsedLeaves(mWfhUsed));
            this.props.dispatch(LeavesState.updateRemainingLeaves(mWfhAssigned));


            if (this.props.LeavesState.fromDateText === 'From Date') {
                alert("Enter From Date");
                //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                //this.props.dispatch(LeavesState.showError(e));         
                this.props.dispatch(LeavesState.showApplyButton(true));
                this.props.dispatch(LeavesState.toggleProgress(false));
                return;
            }

            let toDate = this.props.LeavesState.toDate;

            if (this.props.LeavesState.isSingleDay == true) {
                toDate = this.props.LeavesState.fromDate;
            } else {
                if (this.props.LeavesState.toDateText === 'To Date') {
                    alert("Enter To Date");
                    //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    //this.props.dispatch(LeavesState.showError(e));         
                    this.props.dispatch(LeavesState.showApplyButton(true));
                    this.props.dispatch(LeavesState.toggleProgress(false));
                    return;
                }
            }

            Api.applyforLeave(mCakeHrIdPaid, this.props.LeavesState.fromDate, toDate,
                this.props.LeavesState.partOfDay,
                this.props.LeavesState.briefMessage, this.props.LeavesState.isPaidLeave).then(
                (resp) => {
                    console.log(resp);
                    if (resp.result.error) {
                        alert(resp.result.error);
                        //ToastAndroid.showWithGravity(resp.result.error, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        //this.props.dispatch(LeavesState.showError(resp.result.error));         
                    } else {
                        alert(resp.result.success);

                        //if success reset the state
                        this.props.dispatch(LeavesState.reset());

                        //ToastAndroid.showWithGravity(resp.result.success, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        //this.props.dispatch(LeavesState.showSuccess(resp.result.success));
                    }
                    this.props.dispatch(LeavesState.showApplyButton(true));
                    this.props.dispatch(LeavesState.toggleProgress(false));
                }
                ).catch((e) => {
                    //alert(e)
                    //alert("There was some error, check your internet connection");
                    //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    //this.props.dispatch(LeavesState.showError(e));         
                    this.props.dispatch(LeavesState.showApplyButton(true));
                    this.props.dispatch(LeavesState.toggleProgress(false));
                });
        }).catch((e) => {
            alert("There was some error, check your internet connection");
            //ToastAndroid.showWithGravity("There was some error, check your internet connection", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            //this.props.dispatch(LeavesState.showError(e));         
            this.props.dispatch(LeavesState.showApplyButton(true));
            this.props.dispatch(LeavesState.toggleProgress(false));
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
        height: 850,
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15
    }
});

export default LeavesView;