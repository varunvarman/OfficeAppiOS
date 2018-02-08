import { fromJS } from 'immutable';

export const RESET = 'wfnState/RESET';
export const APPLY_ERROR = 'wfnState/APPLY_ERROR';
export const APPLY_SUCCESS = 'wfnState/APPLY_SUCCESS';
export const SHOW_PROGRESS = 'wfnState/SHOW_PROGRESS';
export const APPLY_BUTTON_TOGGLE = 'wfnState/APPLY_BUTTON_TOGGLE';
export const SHOW_NUMBER_OF_DAYS_PICKER = 'wfnState/SHOW_NUMBER_OF_DAYS_PICKER';
export const UPDATE_FROM_DATE = "wfnState/UPDATE_FROM_DATE";
export const UPDATE_TO_DATE = "wfnState/UPDATE_TO_DATE";
export const NUMBER_OF_DAYS = "wfnState/NUMBER_OF_DAYS";
export const PART_OF_DAY = "wfnState/PART_OF_DAY";
export const USED_LEAVES = "wfnState/USED_LEAVES";
export const REMAINING_LEAVES = "wfnState/REMAINING_LEAVES";
export const UPDATE_NUMBER_DAYS_PICKER = "wfnState/UPDATE_NUMBER_DAYS_PICKER";
export const UPDATE_PART_DAY_PICKER = "wfnState/UPDATE_PART_DAY_PICKER";
export const UPDATE_FROM_DATE_PICKER = "wfnState/UPDATE_FROM_DATE_PICKER";
export const UPDATE_TO_DATE_PICKER = "wfnState/UPDATE_TO_DATE_PICKER";
export const BRIEF_MESSAGE = "wfnState/BRIEF_MESSAGE";

export const [FULL_DAY, FIRST_HALF, SECOND_HALF] = ['Full Day', 'First Half', 'Second Half'];


const initialState = fromJS({
    showProgress: false,
    errorMessage: "",
    successMessage: "",
    showApplyButton: true,
    fromDate: new Date(),
    fromDateText: 'From Date',
    toDate: new Date(),
    toDateText: 'To Date',
    isSingleDay: true,
    partOfDay: FULL_DAY,
    usedLeaves: "0",
    remainingLeaves: "24",
    showNumberOfDaysPicker: false,
    showPartOfDayPicker: false,
    showFromDatePicker: false,
    showToDatePicker: false,
    briefMessage: ""
});


export function updateNumberDaysPicker(showPicker) {
    return {
        type: UPDATE_NUMBER_DAYS_PICKER,
        payload: showPicker
    }
}

export function updatePartOfDayPicker(showPicker) {
    return {
        type: UPDATE_PART_DAY_PICKER,
        payload: showPicker
    }
}

export function updateFromDatePicker(showPicker) {
    return {
        type: UPDATE_FROM_DATE_PICKER,
        payload: showPicker
    }
}

export function updateToDatePicker(showPicker) {
    return {
        type: UPDATE_TO_DATE_PICKER,
        payload: showPicker
    }
}

export function updateFromDate(date) {
    const dateText = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    return {
        type: UPDATE_FROM_DATE,
        payload: [date, dateText]
    }
}

export function updateToDate(date) {
    const dateText = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    return {
        type: UPDATE_TO_DATE,
        payload: [date, dateText]
    }
}

export function updateNumberOfDays(day) {
    var isSingle = true;
    if (day != "One Day") {
        isSingle = false;
    }

    return {
        type: NUMBER_OF_DAYS,
        payload: isSingle
    }
}

export function updatePartOfDay(partOfDay) {
    return {
        type: PART_OF_DAY,
        payload: partOfDay
    }
}


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

export function showError(errorMessage) {
    return {
        type: APPLY_ERROR,
        payload: errorMessage
    };
}

export function showSuccess(successMessage) {
    return {
        type: APPLY_SUCCESS,
        payload: successMessage
    };
}

export function showApplyButton(isButtonVisible) {
    return {
        type: APPLY_BUTTON_TOGGLE,
        payload: isButtonVisible
    };
}

export function updateUsedLeaves(usedLeaves) {
    if (usedLeaves === '0.0') {
        usedLeaves = "0";
    }
    return {
        type: USED_LEAVES,
        payload: usedLeaves
    };
}

export function updateRemainingLeaves(reaminingLeaves) {
    if (reaminingLeaves === '0.0') {
        reaminingLeaves = "0";
    }
    return {
        type: REMAINING_LEAVES,
        payload: reaminingLeaves
    };
}

export function updateBriefMessage(message) {
    return {
        type: BRIEF_MESSAGE,
        payload: message
    };
}


// Reducer
export default function WfhStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case RESET:
            var usedLeaves = state.get("usedLeaves");
            var remainingLeaves = state.get("remainingLeaves");
            state = initialState.merge({ "usedLeaves": usedLeaves, "remainingLeaves": remainingLeaves });
            return state;


        case SHOW_PROGRESS:
            return state.set("showProgress", action.payload);

        case APPLY_BUTTON_TOGGLE:
            return state.set("showApplyButton", action.payload);

        case APPLY_SUCCESS:
            return state.set("successMessage", action.payload);

        case APPLY_ERROR:
            return state.set("errorMessage", action.payload);

        case UPDATE_FROM_DATE:
            state = state.merge({
                "fromDate": action.payload[0],
                "fromDateText": action.payload[1]
            });
            return state;

        case UPDATE_TO_DATE:
            state = state.merge({
                "toDate": action.payload[0],
                "toDateText": action.payload[1]
            });
            return state;

        case NUMBER_OF_DAYS:
            return state.set("isSingleDay", action.payload);

        case PART_OF_DAY:
            return state.set("partOfDay", action.payload);

        case USED_LEAVES:
            return state.set("usedLeaves", action.payload);

        case REMAINING_LEAVES:
            return state.set("remainingLeaves", action.payload);

        case UPDATE_NUMBER_DAYS_PICKER:
            return state.set("showNumberOfDaysPicker", action.payload);

        case UPDATE_PART_DAY_PICKER:
            return state.set("showPartOfDayPicker", action.payload);

        case UPDATE_FROM_DATE_PICKER:
            return state.set("showFromDatePicker", action.payload);

        case UPDATE_TO_DATE_PICKER:
            return state.set("showToDatePicker", action.payload);

        case BRIEF_MESSAGE:
            return state.set("briefMessage", action.payload);

        default:
            return state;
    }
}
