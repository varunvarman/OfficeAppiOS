import {fromJS} from 'immutable';

export const RESET = 'LoginState/RESET';
export const LOGIN_ERROR = 'LoginState/LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LoginState/LOGIN_SUCCESS';
export const SHOW_PROGRESS = 'LoginState/SHOW_PROGRESS';
export const LOGIN_BUTTON_TOGGLE = 'LoginState/LOGIN_BUTTON_TOGGLE';

const initialState = fromJS({
    showProgress: false,
    errorMessage: "",
    successMessage: "",
    showLoginButton: true
});



export function toggleProgress(isProgress) {
    return {
        type: SHOW_PROGRESS,
        payload: isProgress
    };
}

export function reset() {
    return {
        type: RESET
    };
}

export function loginError(errorMessage) {
    return {
        type: LOGIN_ERROR,
        payload: errorMessage
    };
}

export function loginSuccess(successMessage) {
    return {
        type: LOGIN_SUCCESS,
        payload: successMessage
    };
}

export function showLoginButton(isButtonVisible) {
    return {
        type: LOGIN_BUTTON_TOGGLE,
        payload: isButtonVisible
    };
}


// Reducer
export default function LoginStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case RESET:
            return state.set(initialState);
        case SHOW_PROGRESS:
            return state.set("showProgress",action.payload);
        case LOGIN_BUTTON_TOGGLE:
            return state.set("showLoginButton",action.payload);
        case LOGIN_SUCCESS:
            return state.set("successMessage",action.payload);
        case LOGIN_ERROR:
            return state.set("errorMessage",action.payload);
        default:
            return state;
    }

}
