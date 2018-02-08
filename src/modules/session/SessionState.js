import {Map} from 'immutable';

export const RESET_STATE = 'SessionState/RESET';
export const INITIALIZE_STATE = 'SessionState/INITIALIZE';
export const CHECKED_LOGIN = 'SessionState/CHECKEDLOGIN';
export const LOGOUT_SESSION = 'SessionState/LOGOUT';
export const WAIT_STATE = 'SessionState/WAITSTATE';

// Initial state
const initialState = Map({
    isLogin: false,
    isReady: false
});

export function resetSessionStateFromSnapshot(state) {
    return {
        type: RESET_STATE,
        payload: state
    };
}

export function initializeSessionState() {
    return {
        type: INITIALIZE_STATE
    };
}

export function makeUserWait() {
    return {
        type: WAIT_STATE
    };
}

export function checkedLoginSessionState() {
    return {
        type: CHECKED_LOGIN
    };
}

export function logoutSessionState() {
    return {
        type: LOGOUT_SESSION
    };
}

// Reducer
export default function SessionStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case INITIALIZE_STATE:
        case RESET_STATE:
            return state.set("isReady", true);
        case CHECKED_LOGIN:
            return state.set("isLogin", true);
        case LOGOUT_SESSION:
            return state.set("isLogin", false);
        case WAIT_STATE:
            return state.set("isReady", false);
        default:
            return state;
    }

}
