import { fromJS } from 'immutable';

export const UPDATE_TIME = 'SettingsState/UPDATE_TIME';
export const SHOW_PICKER = 'SettingsState/SHOW_PICKER';
export const UPDATE_OFFICE_COORDINATES_LATITUDE = 'SettingsState/UPDATE_OFFICE_COORDINATES_LATITUDE';
export const UPDATE_OFFICE_COORDINATES_LONGITUDE = 'SettingsState/UPDATE_OFFICE_COORDINATES_LONGITUDE';
export const TOGGLE_ACTIVITY_INDICATOR = 'SettingsState/TOGGLE_ACTIVITY_INDICATOR';
export const RESET_OFFICE_COORDINATES = 'SettingsState/RESET_OFFICE_COORDINATES';
export const TOGGLE_KEYBOARD_VISIBILITY = 'SettingsState/TOGGLE_KEYBOARD_VISIBILITY'; 

// initialState
const initialState = fromJS({
    showPicker: false,
    time: (new Date((new Date().getFullYear()), (new Date().getMonth()), (new Date().getDate()), 9, 30, 0, 0)),
    officeLocation: {
        latitude: 15.4561103,
        longitude: 73.8222992
    },
    activityIndicatorAnimating: false,
    keyboardVisible: false
});

// ACTION METHODS
export function showPickerView(visible) {
    return {
        type: SHOW_PICKER,
        payload: visible
    }
}

export function updateDateTime(dateTime) {
    return {
        type: UPDATE_TIME,
        payload: dateTime
    }
}

export function updateOfficeLocationLatitude(latitude) {
    return {
        type: UPDATE_OFFICE_COORDINATES_LATITUDE,
        payload: latitude
    }
}

export function updateOfficeLocationLongitude(longitude) {
    return {
        type: UPDATE_OFFICE_COORDINATES_LONGITUDE,
        payload: longitude
    }
}

export function toggleActivityIndicator(visibility) {
    return {
        type: TOGGLE_ACTIVITY_INDICATOR,
        payload: visibility
    }
}

export function resetCoordinates() {
    return {
        type: RESET_OFFICE_COORDINATES,
        payload: initialState.officeLocation
    }
}

export function toggleKeyboardVisibility(visibility) {
    return {
        type: TOGGLE_KEYBOARD_VISIBILITY,
        payload: visibility
    }
}

// REDUCER
export default function SettingsViewReducer(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_TIME:
            return state.set('time', action.payload);
        
        case SHOW_PICKER:
            return state.set('showPicker', action.payload);

        case UPDATE_OFFICE_COORDINATES_LATITUDE:
        console.log('COORDINATE LATITUDE: ' + JSON.stringify(action.payload));
            return state.setIn(['officeLocation', 'latitude'], action.payload);

        case UPDATE_OFFICE_COORDINATES_LONGITUDE:
        console.log('COORDINATE LONGITUDE: ' + JSON.stringify(action.payload));
            return state.setIn(['officeLocation', 'longitude'], action.payload);

        case TOGGLE_ACTIVITY_INDICATOR: 
            return state.set('activityIndicatorAnimating', action.payload);

        case RESET_OFFICE_COORDINATES:
            return state.set('officeLocation', action.payload);

        case TOGGLE_KEYBOARD_VISIBILITY:
            return state.set('keyboardVisible', action.payload);

        default:
            return state;
    }
}
