import { fromJS } from 'immutable';


export const RESET = 'AdminDashboardState/RESET';
export const TOGGLE_DATE_FILTER = 'AdminDashboardState/SELECT_DATE_FILTER';
export const FILTER_DATE = 'AdminDashboardState/FILTER_DATE';
export const EDIT_MODAL = 'AdminDashboardState/EDIT_MODAL';
export const EDIT_MODAL_CHECKIN = 'AdminDashboardState/EDIT_MODAL_CHECKIN';
export const EDIT_MODAL_CHECKOUT = 'AdminDashboardState/EDIT_MODAL_CHECKOUT';
export const EDIT_MODAL_SHOWPROGRESS = 'AdminDashboardState/EDIT_MODAL_SHOWPROGRESS';
export const EDIT_MODAL_CHECKIN_PICKER = 'AdminDashboardState/EDIT_MODAL_CHECKIN_PICKER';
export const EDIT_MODAL_CHECKOUT_PICKER = 'AdminDashboardState/EDIT_MODAL_CHECKOUT_PICKER';
export const EDIT_MODAL_CHECKIN_PROGRESS = 'AdminDashboardState/EDIT_MODAL_CHECKIN_PROGRESS';
export const EDIT_MODAL_CHECKOUT_PROGRESS = 'AdminDashboardState/EDIT_MODAL_CHECKOUT_PROGRESS';
export const EDIT_MODAL_USER_IMAGE = 'AdminDashboardState/EDIT_MODAL_USER_IMAGE';
export const EDIT_MODAL_USERNAME = 'AdminDashboardState/EDIT_MODAL_USERNAME';
export const EDIT_MODAL_USERID = 'AdminDashboardState/EDIT_MODAL_USERID';
export const EDIT_MODAL_TIMELINECHECKINID = 'AdminDashboardState/EDIT_MODAL_TIMELINECHECKINID';
export const EDIT_MODAL_TIMELINECHECKOUTID = 'AdminDashboardState/EDIT_MODAL_TIMELINECHECKOUTID';
export const TIMELINE_DATA = 'AdminDashboardState/TIMELINE_DATA';
export const SHOW_PROGRESS = 'AdminDashboardState/SHOW_PROGRESS';
export const EDIT_TIMING_DATA = 'AdminDashboardState/EDIT_TIMING_DATA';

const dateText = new Date();
const initialState = fromJS({
    showProgress: true,
    errorMessage: "",
    successMessage: "",
    filterDate: new Date(),
    showDatePicker: false,
    showEditModal: false,
    editModalUserImage: 'https://media.gqindia.com/wp-content/uploads/2015/11/gq-monica-belluci-22.jpg',
    editModalUsername: 'Monica Bellucci',
    editModalUserId: '',
    editModalTimelineCheckoutId: '',
    editModalTimelineCheckinId: '',
    editModalCheckinHour: -1,
    editModalCheckinMins: -1,
    editModalCheckinText: 'never came in',
    editModalCheckoutHour: -1,
    editModalCheckoutMins: -1,
    editModalCheckoutText: 'never went out',
    editModalShowProgress: false,
    editModalShowCheckinPicker: false,
    editModalShowCheckoutPicker: false,
    editModalCheckInshowProgress: false,
    editModalCheckoutshowProgress: false,
    filterDateString: dateText.getFullYear() + "-" + (dateText.getMonth() + 1) + "-" + dateText.getDate(),
    timelineData: {
        data: []
    },
    editTimingData: {
        data: {}
    }
});

export function setEditTimingData(data) {

    const checkinTime = data.timeline.checkinTime;
    const checkoutTime = data.timeline.checkoutTime;
    const checkinTimeString = checkinTime === null? 'never came in':_formatTime(new Date(checkinTime).getHours(),new Date(checkinTime).getMinutes())
    const checkoutTimeString = checkoutTime === null?'never went out':_formatTime(new Date(checkoutTime).getHours(),new Date(checkoutTime).getMinutes())
    return {
        type: EDIT_TIMING_DATA,
        payload: data,
        checkinHour: checkinTime === null? -1: new Date(checkinTime).getHours(),
        checkinMin : checkinTime === null? -1: new Date(checkinTime).getMinutes(),
        checkinTimeText : checkinTimeString,
        checkoutHour : checkoutTime === null? -1: new Date(checkoutTime).getHours(),
        checkoutMin : checkoutTime === null? -1: new Date(checkoutTime).getMinutes(),
        checkoutTimeText: checkoutTimeString
    };
}

export function setTimelineData(data) {
    return {
        type: TIMELINE_DATA,
        payload: data
    };
}

export function setUserName(data) {
    return {
        type: EDIT_MODAL_USERNAME,
        payload: data
    };
}

export function setUserID(data) {
    return {
        type: EDIT_MODAL_USERID,
        payload: data
    };
}

export function setTimelineCheckinId(data) {
    return {
        type: EDIT_MODAL_TIMELINECHECKINID,
        payload: data
    };
}

export function setTimelineCheckoutId(data) {
    return {
        type: EDIT_MODAL_TIMELINECHECKOUTID,
        payload: data
    };
}

export function setUserImage(data) {
    return {
        type: EDIT_MODAL_USER_IMAGE,
        payload: data
    };
}

export function resetScreen() {
    return {
        type: RESET
    }
}

export function toggleDatePicker() {
    return {
        type: TOGGLE_DATE_FILTER
    }
}

export function loadinDataFromApi(isLoading) {
    return {
        type: SHOW_PROGRESS,
        isLoading: isLoading
    }
}


export function setFilterDate(date) {
    date = typeof (date) === 'string' ? new Date(date) : date;
    const dateText = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return {
        type: FILTER_DATE,
        dateString: dateText,
        dateObject: date
    }
}

export function toogleEditModal() {
    return {
        type: EDIT_MODAL
    }
}

export function toogleEditShowProgress() {
    return {
        type: EDIT_MODAL_SHOWPROGRESS
    }
}


export function toogleEditModalCheckinPicker() {
    return {
        type: EDIT_MODAL_CHECKIN_PICKER
    }
}


export function toogleEditModalCheckoutPicker() {
    return {
        type: EDIT_MODAL_CHECKOUT_PICKER
    }
}


export function updateEditModalCheckinTime(hour, min) {
    const timeText = _formatTime(hour, min);
    return {
        type: EDIT_MODAL_CHECKIN,
        payloadHour: hour,
        payloadMin: min,
        payloadTimeText: timeText
    }
}

export function updateEditModalCheckoutTime(hour, min) {
    const timeText = _formatTime(hour, min);
    return {
        type: EDIT_MODAL_CHECKOUT,
        payloadHour: hour,
        payloadMin: min,
        payloadTimeText: timeText
    }
}

export function toogleEditModalCheckinProgress() {
    return {
        type: EDIT_MODAL_CHECKIN_PROGRESS
    }
}

export function toogleEditModalCheckoutProgress() {
    return {
        type: EDIT_MODAL_CHECKOUT_PROGRESS
    }
}

/**
 * Returns e.g. '3:05 am'.
 */
function _formatTime(hour, minute) {
    //alert('Test AM '+(hour < 13 ? 'am' : 'pm'))
    return (hour < 13 ? hour : (hour - 12)) + ':' + (minute < 10 ? '0' + minute : minute) + " " + (hour < 12 ? 'am' : 'pm');
}

// Reducer
export default function AdminDashboardStateReducer(state = initialState, action = {}) {
    switch (action.type) {

        case RESET:
            state = initialState;
            return state;

        case TOGGLE_DATE_FILTER:
            return state.set("showDatePicker", !state.get("showDatePicker"));

        case FILTER_DATE:
            state = state.merge({
                "filterDate": action.dateObject,
                "filterDateString": action.dateString
            });
            return state;

        case EDIT_MODAL:
            return state.set("showEditModal", !state.get("showEditModal"));


        case EDIT_MODAL_SHOWPROGRESS:
            return state.set("editModalShowProgress", !state.get("editModalShowProgress"));


        case EDIT_MODAL_CHECKIN:
            state = state.merge({
                "editModalCheckinHour": action.payloadHour,
                "editModalCheckinMins": action.payloadMin,
                "editModalCheckinText": action.payloadTimeText
            });
            return state;

        case EDIT_MODAL_CHECKOUT:
            state = state.merge({
                "editModalCheckoutHour": action.payloadHour,
                "editModalCheckoutMins": action.payloadMin,
                "editModalCheckoutText": action.payloadTimeText
            });
            return state;


        case EDIT_MODAL_CHECKIN_PICKER:
            return state.set("editModalShowCheckinPicker", !state.get("editModalShowCheckinPicker"));

        case EDIT_MODAL_CHECKOUT_PICKER:
            return state.set("editModalShowCheckoutPicker", !state.get("editModalShowCheckoutPicker"));

        case EDIT_MODAL_CHECKIN_PROGRESS:
            return state.set("editModalCheckInshowProgress", !state.get("editModalCheckInshowProgress"));

        case EDIT_MODAL_CHECKOUT_PROGRESS:
            return state.set("editModalCheckoutshowProgress", !state.get("editModalCheckoutshowProgress"));

        case TIMELINE_DATA:
            return state.set("timelineData", action.payload);

        case EDIT_TIMING_DATA:
            state = state.merge({
                "editTimingData": action.payload,
                "editModalCheckinHour": action.checkinHour,
                "editModalCheckinMins": action.checkinMin,
                "editModalCheckinText": action.checkinTimeText,
                "editModalCheckoutHour": action.checkoutHour,
                "editModalCheckoutMins": action.checkoutMin,
                "editModalCheckoutText": action.checkoutTimeText
            });
            return state;

        case SHOW_PROGRESS:
            return state.set("showProgress", action.isLoading);

        case EDIT_MODAL_USERNAME:
            return state.set("editModalUsername", action.payload);

        case EDIT_MODAL_USER_IMAGE:
            return state.set("editModalUserImage", action.payload);

        case EDIT_MODAL_USERID:
            return state.set("editModalUserId", action.payload);

        case EDIT_MODAL_TIMELINECHECKINID:
            return state.set("editModalTimelineCheckinId", action.payload);

        case EDIT_MODAL_TIMELINECHECKOUTID:
            return state.set("editModalTimelineCheckoutId", action.payload);
        default:
            return state;

    }
}