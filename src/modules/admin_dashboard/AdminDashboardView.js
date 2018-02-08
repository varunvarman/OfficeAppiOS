import React, { PropTypes, Component } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ListView,
    Platform,
    DatePickerIOS,
    DatePickerAndroid,
    TouchableHighlight,
    TouchableNativeFeedback,
    Modal,
    Image,
    TimePickerAndroid,
    ActivityIndicator
} from 'react-native';

import * as officeApi from '../../office-server/OfficeApi';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AdminDashboardState from '../admin_dashboard/AdminDashboardState';

let dtaSource

class AdminDashboardView extends Component {

    static displayName = 'AdminDashboardView';

    static propTypes = {
        adminDashboardState: PropTypes.shape({
            showDatePicker: PropTypes.bool.isRequired,
            showEditModal: PropTypes.bool.isRequired
        }).isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentWillUnmount() {
        let date = new Date();
        this.props.dispatch(AdminDashboardState.setFilterDate(date));
    }

    componentDidMount() {
        // reset the local state of this view for the first time`
        this.props.dispatch(AdminDashboardState.resetScreen());
        let date = new Date();
        this.props.dispatch(AdminDashboardState.setFilterDate(date));

        //        let date = typeof (this.props.adminDashboardState.filterDate) === 'string' ? new Date(this.props.adminDashboardState.filterDateString) : this.props.adminDashboardState.filterDate
        this.fetchListData();
    }

    fetchListData() {
        officeApi.getAllUserstimelineforDay(this.props.adminDashboardState.filterDateString).then((resp) => {
            console.log(this._manipulateArrayList(resp.results));
            this.props.dispatch(AdminDashboardState.setTimelineData({ data: this._manipulateArrayList(resp.results) }));
            this.props.dispatch(AdminDashboardState.loadinDataFromApi(false));
        }).catch((err) => {
            alert(err);
        })
    }


    renderEditModal = () => {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.adminDashboardState.showEditModal}
                onRequestClose={() => {
                    this.props.dispatch(AdminDashboardState.toogleEditModal());
                    this.fetchListData()
                }}>

                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={{
                        flex: 1, flexDirection: 'column', backgroundColor: '#d7d7d7',
                        height: 250, marginLeft: 20, marginRight: 20, alignSelf: 'center', borderRadius: 12
                    }}>

                        <View style={{
                            alignSelf: 'flex-end',
                            justifyContent: 'flex-start'
                        }}>

                            <TouchableHighlight underlayColor="transparent" style={{ width: 50 }} onPress={() => {
                                this.props.dispatch(AdminDashboardState.toogleEditModal());
                                this.fetchListData();
                            }}>
                                <Icon
                                    size={20}
                                    color='#464763'
                                    name="close"
                                    style={{ alignSelf: "center", marginTop: 15, backgroundColor: "transparent" }}
                                />
                            </TouchableHighlight>
                        </View>


                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.props.adminDashboardState.editTimingData.image !== 'http://dietco.de' &&
                                <Image style={[styles.circularImage]} source={{ uri: this.props.adminDashboardState.editTimingData.image }} />
                            }
                            {this.props.adminDashboardState.editTimingData.image === 'http://dietco.de' &&
                                <Image style={[styles.circularImage]} source={require('../../../images/default_pro.png')} />
                            }
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.props.adminDashboardState.editTimingData.name}</Text>
                        </View>


                        <View style={{ flex: 0.5, flexDirection: 'row' }}>

                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', padding: 2 }}>Check in</Text>

                                {Platform.OS === 'android' &&
                                    !this.props.adminDashboardState.editModalCheckInshowProgress &&
                                    <View style={{ flex: 1, marginBottom: 5, alignItems: 'center' }}>
                                        <Button
                                            onPress={() => {
                                                this.showCheckinTimePicker();
                                            }}
                                            color='#464763'
                                            title={this.props.adminDashboardState.editModalCheckinText} />
                                    </View>
                                }

                                {Platform.OS === 'ios' &&
                                    !this.props.adminDashboardState.editModalCheckInshowProgress &&
                                    <View style={{ flex: 1, backgroundColor: '#464763', marginBottom: 10, alignItems: 'center' }}>
                                        <Button
                                            onPress={() => {

                                                checkinDate = typeof (this.props.adminDashboardState.filterDate) === 'string' ?
                                                    new Date(this.props.adminDashboardState.filterDate) :
                                                    this.props.adminDashboardState.filterDate;

                                                if (this.props.adminDashboardState.editModalCheckinHour !== -1) {
                                                    checkinDate.setHours(this.props.adminDashboardState.editModalCheckinHour)
                                                }
                                                if (this.props.adminDashboardState.editModalCheckinMins !== -1) {
                                                    checkinDate.setMinutes(this.props.adminDashboardState.editModalCheckinMins);
                                                }

                                                this.props.dispatch(AdminDashboardState.setFilterDate(checkinDate))

                                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckinPicker());
                                            }}
                                            color='#ffffff'
                                            title={this.props.adminDashboardState.editModalCheckinText} />
                                    </View>
                                }

                                {this.props.adminDashboardState.editModalCheckInshowProgress &&
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                }

                            </View>




                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', padding: 2 }}>Check out</Text>
                                {Platform.OS === 'android' &&
                                    !this.props.adminDashboardState.editModalCheckoutshowProgress &&
                                    <View style={{ flex: 1, marginBottom: 5, alignItems: 'center' }}>
                                        <Button
                                            onPress={() => {
                                                this.showCheckoutTimePicker();
                                            }}
                                            color='#464763'
                                            title={this.props.adminDashboardState.editModalCheckoutText} />
                                    </View>
                                }

                                {Platform.OS === 'ios' &&
                                    !this.props.adminDashboardState.editModalCheckoutshowProgress &&
                                    <View style={{ flex: 1, backgroundColor: '#464763', marginBottom: 10, alignItems: 'center' }}>
                                        <Button
                                            onPress={() => {

                                                checkoutDate = typeof (this.props.adminDashboardState.filterDate) === 'string' ?
                                                    new Date(this.props.adminDashboardState.filterDate) :
                                                    this.props.adminDashboardState.filterDate;

                                                if (this.props.adminDashboardState.editModalCheckoutHour !== -1) {
                                                    checkoutDate.setHours(this.props.adminDashboardState.editModalCheckoutHour)
                                                }
                                                if (this.props.adminDashboardState.editModalCheckoutMins !== -1) {
                                                    checkoutDate.setMinutes(this.props.adminDashboardState.editModalCheckoutMins);
                                                }

                                                this.props.dispatch(AdminDashboardState.setFilterDate(checkoutDate))

                                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutPicker());
                                            }}
                                            color='#ffffff'
                                            title={this.props.adminDashboardState.editModalCheckoutText} />
                                    </View>
                                }

                                {this.props.adminDashboardState.editModalCheckoutshowProgress &&
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                }
                            </View>

                        </View>
                    </View>
                </View>

                {this.renderEditModalCheckinPicker()}
                {this.renderEditModalCheckoutPicker()}

            </Modal>
        )
    }



    renderEditModal2 = () => {
        return (

            <View>
                {
                    this.props.adminDashboardState.showEditModal &&
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{
                            flex: 1, flexDirection: 'column', backgroundColor: '#d7d7d7',
                            height: 250, marginLeft: 20, marginRight: 20, alignSelf: 'center', borderRadius: 12
                        }}>


                        </View>

                    </View>
                }

            </View>

        )
    }


    /**
     * Android Checkin Time Native Picker
     */
    showCheckinTimePicker = async (checkinId) => {
        let _options = {
            is24Hour: false
        }

        if (this.props.adminDashboardState.editModalCheckinHour !== -1) {
            _options = {
                is24Hour: false,
                hour: this.props.adminDashboardState.editModalCheckinHour,
                minute: this.props.adminDashboardState.editModalCheckinMins,
            }
        }

        try {
            const { action, hour, minute } = await TimePickerAndroid.open(_options);
            if (action === TimePickerAndroid.dismissedAction) {
                //do nothing
            } else {
                let date = typeof (this.props.adminDashboardState.filterDate) === 'string' ? new Date(this.props.adminDashboardState.filterDate) :
                    this.props.adminDashboardState.filterDate;
                date.setHours(hour, minute, 0);
                this.props.dispatch(AdminDashboardState.toogleEditModalCheckinProgress());
                officeApi.adminUpdateCheckinCheckoutTime(this.props.adminDashboardState.editTimingData.userId,
                    this.props.adminDashboardState.editTimingData.timeline.checkinId, 'checkin', date).then((resp) => {
                        alert("Successfully Updated Checkin Time");
                        this.props.dispatch(AdminDashboardState.updateEditModalCheckinTime(hour, minute));
                    }).catch((exp) => {
                        alert("Error, " + exp)
                    }).then(() => {
                        this.props.dispatch(AdminDashboardState.toogleEditModalCheckinProgress());
                    });
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    /**
     * Android Checkout Time Native Picker
     */
    showCheckoutTimePicker = async (checkoutId) => {
        let _options = {
            is24Hour: false
        }

        if (this.props.adminDashboardState.editModalCheckoutHour !== -1) {
            _options = {
                is24Hour: false,
                hour: this.props.adminDashboardState.editModalCheckoutHour,
                minute: this.props.adminDashboardState.editModalCheckoutMins,
            }
        }

        try {
            const { action, hour, minute } = await TimePickerAndroid.open(_options);
            if (action === TimePickerAndroid.dismissedAction) {
                //do nothing
            } else {
                let date = typeof (this.props.adminDashboardState.filterDate) === 'string' ? new Date(this.props.adminDashboardState.filterDate) :
                    this.props.adminDashboardState.filterDate;
                date.setHours(hour, minute, 0);

                //if hours are greater no need to check minutes
                if (hour < this.props.adminDashboardState.editModalCheckinHour) {
                    alert('Checkout Time cannot be before Checkin Time')
                    return;

                }

                //if hours are same, check minutes
                if (hour === this.props.adminDashboardState.editModalCheckinHour) {
                    alert('gaan tuji' + minute)
                    if (minute < this.props.adminDashboardState.editModalCheckinMins) {
                        alert('Checkout Time cannot be before Checkin Time')
                        return;
                    }
                }

                this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutProgress());

                officeApi.adminUpdateCheckinCheckoutTime(this.props.adminDashboardState.editTimingData.userId,
                    this.props.adminDashboardState.editTimingData.timeline.checkoutId, 'checkout', date).then((resp) => {
                        this.props.dispatch(AdminDashboardState.updateEditModalCheckoutTime(hour, minute));
                        alert("Successfully Updated Checkout Time");
                    }).catch((exp) => {
                        alert("Error, " + exp)
                    }).then(() => {
                        this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutProgress());
                    });
                //TODO: make api call
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };

    renderDateModal = () => {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.adminDashboardState.showDatePicker}
                onRequestClose={() => { this.props.dispatch(AdminDashboardState.toggleDatePicker()) }}>

                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                <View style={{ backgroundColor: '#d7d7d7' }}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                        <Button
                            onPress={() => {
                                this.props.dispatch(AdminDashboardState.toggleDatePicker());
                            }}
                            title="Done" />
                    </View>
                </View>


                <DatePickerIOS
                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                    date={typeof (this.props.adminDashboardState.filterDate) === 'string' ? new Date() : this.props.adminDashboardState.filterDate}
                    maximumDate={new Date()}
                    mode="date"
                    onDateChange={(date) => {
                        this.props.dispatch(AdminDashboardState.setFilterDate(date));
                        this._loadListData(date);
                    }}
                />

            </Modal>
        )
    }


    /**Show Android From Date Picker */
    showFromPicker = async (options) => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: typeof (this.props.adminDashboardState.filterDate) === 'string' ?
                    new Date(this.props.adminDashboardState.filterDate) : this.props.adminDashboardState.filterDate,
                maxDate: new Date()
            });
            if (action === DatePickerAndroid.dismissedAction) {
                //do nothing
            } else {
                var date = new Date(year, month, day);
                this.props.dispatch(AdminDashboardState.setFilterDate(date));
                this._loadListData(date);
            }
        } catch (message) {
            console.warn(`Error in example `, message);
        }
    };




    render() {


        const { dispatch, adminDashboardState } = this.props;

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        dtaSource = { dataSource: ds.cloneWithRows(this.props.adminDashboardState.timelineData.data.length > 0 ? this.props.adminDashboardState.timelineData.data : []) };

        return (
            <View style={styles.container}>

                {this.renderEditModal()}

                <View style={styles.selector}>

                    <TouchableHighlight underlayColor="transparent" style={{ width: 50 }} onPress={() => {
                        this._clickPreviousDate(dispatch);
                    }}>
                        <Icon
                            size={20}
                            color='#fff'
                            name="angle-left"
                            style={{ alignSelf: "center", marginTop: 15, backgroundColor: "transparent" }}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" style={{ flex: 1 }} onPress={() => {
                        { (Platform.OS === 'android') && this.showFromPicker() }
                        { (Platform.OS === 'ios') && dispatch(AdminDashboardState.toggleDatePicker()); }
                    }}>
                        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center" }}>
                            <Text style={{ color: "#ffffff", fontSize: 20, alignSelf: "center" }}>{
                                this.props.adminDashboardState.filterDateString
                            }</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" style={{ width: 50 }} onPress={() => {
                        this._clickNextDate(dispatch);
                    }}>
                        <Icon
                            size={20}
                            color='#fff'
                            name="angle-right"
                            style={{ alignSelf: "center", marginTop: 15, backgroundColor: "transparent" }}
                        />
                    </TouchableHighlight>
                    {this.renderDateModal()}
                </View>

                <View style={styles.checklist}>

                    {!this.props.adminDashboardState.showProgress && <ListView
                        {...dtaSource}
                        enableEmptySections={true}
                        renderRow={(rowData) =>
                            <TouchableHighlight underlayColor="transparent" style={{ flex: 1 }} onPress={() => {

                                this.props.dispatch(AdminDashboardState.toogleEditModal())
                                this.props.dispatch(AdminDashboardState.setEditTimingData(rowData));

                            }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: .2, height: 70, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'center', alignItems: "center" }}>
                                        {
                                            rowData.image !== 'http://dietco.de' &&
                                            <Image style={styles.image} source={{ uri: rowData.image }} />
                                        }
                                        {rowData.image === 'http://dietco.de' &&
                                            <Image style={styles.image} source={require('../../../images/default_pro.png')} />
                                        }
                                    </View>
                                    <View style={{ flex: .3, height: 70, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'center' }}>
                                        <Text style={{ backgroundColor: "transparent", color: "#999", fontSize: 12 }}> {rowData.name} </Text>
                                    </View>
                                    <View style={{ flex: .25, height: 70, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'center' }}>
                                        <Text style={{ backgroundColor: "transparent", color: "#333", fontSize: 16 }}>Checkin </Text>
                                        <Text style={{ backgroundColor: "transparent", color: "#999", fontSize: 12 }}>{this._getTimeFromDate(rowData.timeline.checkinTime)} </Text>
                                    </View>
                                    <View style={{ flex: .25, height: 70, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'center' }}>
                                        <Text style={{ backgroundColor: "transparent", color: "#333", fontSize: 16 }}>Checkout </Text>
                                        <Text style={{ backgroundColor: "transparent", color: "#999", fontSize: 12 }}>{this._getTimeFromDate(rowData.timeline.checkoutTime)}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        }
                    />}

                    {this.props.adminDashboardState.showProgress && <ActivityIndicator style={styles.progressBar}
                        size="large"
                        color="blue"
                    />}

                </View>
            </View>
        );
    }

    _dateSelector = () => {

        return (
            <DatePickerIOS
                style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                date={new Date()}
                mode="date"
                onDateChange={(date) => {

                }}
            />
        );

    }

    renderEditModalCheckinPicker = (checkinId) => {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.adminDashboardState.editModalShowCheckinPicker}
                onRequestClose={() => { this.props.dispatch(AdminDashboardState.toogleEditModalCheckinPicker()) }}>

                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                <View style={{ backgroundColor: '#d7d7d7' }}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                        <Button
                            onPress={() => {
                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckinPicker());

                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckinProgress());
                                officeApi.adminUpdateCheckinCheckoutTime(this.props.adminDashboardState.editTimingData.userId,
                                    this.props.adminDashboardState.editTimingData.timeline.checkinId, 'checkin', this.props.adminDashboardState.filterDate)
                                    .then((resp) => {
                                        this.props.dispatch(AdminDashboardState.updateEditModalCheckinTime
                                            (this.props.adminDashboardState.filterDate.getHours(),
                                            this.props.adminDashboardState.filterDate.getMinutes()));
                                        alert("Successfully Updated Checkin Time");
                                    }).catch((exp) => {
                                        alert("Error, " + exp)
                                    }).then(() => {
                                        this.props.dispatch(AdminDashboardState.toogleEditModalCheckinProgress());
                                    });

                            }}
                            title="Done" />
                    </View>
                </View>

                <DatePickerIOS
                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                    date={typeof (this.props.adminDashboardState.filterDate) === 'string' ?
                        new Date(this.props.adminDashboardState.filterDate) : this.props.adminDashboardState.filterDate}
                    mode="time"
                    onDateChange={(date) => {
                        this.props.dispatch(AdminDashboardState.setFilterDate(date))
                    }}
                />

            </Modal>
        );
    }

    renderEditModalCheckoutPicker = (checkoutId) => {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.adminDashboardState.editModalShowCheckoutPicker}
                onRequestClose={() => { this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutPicker()) }}>

                <View style={{ flex: 1, backgroundColor: '#000000', opacity: .6 }} />

                <View style={{ backgroundColor: '#d7d7d7' }}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#d7d7d7' }}>
                        <Button
                            onPress={() => {
                                //this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutPicker());


                                //if hours are greater no need to check minutes
                                if (this.props.adminDashboardState.filterDate.getHours() < this.props.adminDashboardState.editModalCheckinHour) {
                                    alert('Checkout Time cannot be before Checkin Time')
                                    return;

                                }

                                //if hours are same, check minutes
                                if (this.props.adminDashboardState.filterDate.getHours() === this.props.adminDashboardState.editModalCheckinHour) {
                                    if (this.props.adminDashboardState.filterDate.getMinutes() < this.props.adminDashboardState.editModalCheckinMins) {
                                        alert('Checkout Time cannot be before Checkin Time')
                                        return;
                                    }
                                }

                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutPicker());
                                this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutProgress());


                                officeApi.adminUpdateCheckinCheckoutTime(this.props.adminDashboardState.editTimingData.userId,
                                    this.props.adminDashboardState.editTimingData.timeline.checkoutId, 'checkout',
                                    this.props.adminDashboardState.filterDate).then((resp) => {
                                        this.props.dispatch(AdminDashboardState.updateEditModalCheckoutTime
                                            (this.props.adminDashboardState.filterDate.getHours(), this.props.adminDashboardState.filterDate.getMinutes()));
                                        alert("Successfully Updated Checkin Time");
                                    }).catch((exp) => {
                                        alert("Error, " + exp)
                                    }).then(() => {
                                        this.props.dispatch(AdminDashboardState.toogleEditModalCheckoutProgress());
                                    });
                            }}
                            title="Done" />
                    </View>
                </View>

                <DatePickerIOS
                    style={{ backgroundColor: '#d7d7d7', paddingBottom: 10, paddingLeft: 10 }}
                    date={typeof (this.props.adminDashboardState.filterDate) === 'string' ?
                        new Date(this.props.adminDashboardState.filterDate) : this.props.adminDashboardState.filterDate}
                    mode="time"
                    onDateChange={(date) => {
                        this.props.dispatch(AdminDashboardState.setFilterDate(date))
                    }}
                />

            </Modal>
        );
    }


    _manipulateArrayList(results) {

        let newList = []
        let counter = 0;

        for (let i = 0; i < results.length; i++) {
            let userObject = {
                userId: results[i].user.id,
                name: results[i].user.firstName,
                image: results[i].user.profileImage,
                timeline: {
                    checkinTime: null,
                    checkoutTime: null,
                    checkinId: null,
                    checkoutId: null
                }
            }



            let checkinTimeline = results[i].timeline.filter((t) => {
                if (t.type === 'checkin') {
                    return t;
                }

            });

            let checkoutTimeline = results[i].timeline.reverse().filter((t) => {
                if (t.type === 'checkout') {
                    return t;
                }

            });

            userObject.timeline.checkinTime = (checkinTimeline && checkinTimeline.length && checkinTimeline[0].createdAt) || null;
            userObject.timeline.checkoutTime = (checkoutTimeline && checkoutTimeline.length && checkoutTimeline[0].createdAt) || null;
            userObject.timeline.checkinId = (checkinTimeline && checkinTimeline.length && checkinTimeline[0].id) || null;
            userObject.timeline.checkoutId = (checkoutTimeline && checkoutTimeline.length && checkoutTimeline[0].id) || null;

            newList.splice(counter, 0, userObject);
            counter++;
        }

        return newList;
    }

    _getTimeFromDate(checkinTime) {
        if (checkinTime === null) {
            return "No Data";
        }
        let date = new Date(checkinTime);
        let hours = date.getHours();
        let minute = date.getMinutes();
        return hours + ":" + minute;
    }

    _clickPreviousDate(dispatch) {
        let date = typeof (this.props.adminDashboardState.filterDate) === "string" ? new Date(this.props.adminDashboardState.filterDate) : this.props.adminDashboardState.filterDate;
        date.setDate(date.getDate() - 1);
        dispatch(AdminDashboardState.setFilterDate(date));
        this._loadListData(date);

    }

    _clickNextDate(dispatch) {
        let date = typeof (this.props.adminDashboardState.filterDate) === "string" ? new Date(this.props.adminDashboardState.filterDate) : this.props.adminDashboardState.filterDate;
        let todayDate = new Date();
        if (date.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0)) {
            alert('Cannot edit timings for future dates')
            return;
        }
        date.setDate(date.getDate() + 1);
        dispatch(AdminDashboardState.setFilterDate(date));
        this._loadListData(date);
    }

    _loadListData(date) {
        this.props.dispatch(AdminDashboardState.loadinDataFromApi(true));
        officeApi.getAllUserstimelineforDay(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()).then((resp) => {
            console.log(this._manipulateArrayList(resp.results));
            this.props.dispatch(AdminDashboardState.setTimelineData({ data: this._manipulateArrayList(resp.results) }));
            this.props.dispatch(AdminDashboardState.loadinDataFromApi(false));
        }).catch((err) => {
            this.props.dispatch(AdminDashboardState.loadinDataFromApi(false));
            alert(err);
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff"
    },
    selector: {
        flex: 0.1,
        flexDirection: "row",
        backgroundColor: "#333"
    },
    checklist: {
        flex: 0.9,
        flexDirection: "column",
        backgroundColor: "#fff"
    },
    plainText: {
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 15,
        color: '#fff'

    },

    basicText: {
        flex: 1,
        backgroundColor: "transparent",
        paddingLeft: 5,
        textAlign: 'left', color: "#000000", fontSize: 16,
    },
    image: {
        height: 40,
        marginTop: 5,
        width: 40,
        borderRadius: 20
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

    circularImage: {
        height: 80,
        width: 80,
        borderRadius: 40
    },

    progressBar: {
        opacity: 1,
        alignSelf: "center",
        padding: 10,
        marginTop: 20,
        marginBottom: 20

    }
});

export default AdminDashboardView;
