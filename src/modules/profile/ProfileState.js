import {fromJS} from 'immutable';

export const PROFILE_UPDATE = 'ProfileState/PROFILE_UPDATE';
export const PROFILE_RESET = 'ProfileState/PROFILE_RESET';
export const PROFILE_ERROR = 'ProfileState/PROFILE_ERROR';

const initialValue = fromJS({
    username: '',
    description: '',
    hours: '',
    projects: {
        devReady: 0,
        inProgress: 0,
        completed: 0
    }
});


// ACTIONS
export default function updateProfile(data) {
    return {
        type: PROFILE_UPDATE,
        details: data
    };
}

export default function resetProfile() {
    return {
        type: PROFILE_RESET
    };
}

export default function errorProfile() {
    return {
        type: PROFILE_ERROR
    };
}

// REDUCER
export default function ProfileStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case PROFILE_RESET:
            return initialState;
        case PROFILE_UPDATE:
            state.set('username', action.details.username);
            state.set('description', action.details.description);
            state.set('description', action.details.hours);
            state.setIn(['projects', 'devReady'], action.details.projects.devReady);
            state.setIn(['projects', 'inProgress'], action.details.projects.inProgress);
            state.setIn(['projects', 'completed'], action.details.projects.completed);
            return state;
        case PROFILE_ERROR:
            return state;
        default:
            return state;
    }
}