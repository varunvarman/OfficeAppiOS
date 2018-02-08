import { fromJS } from 'immutable';

export const RESET = 'LeavesState/RESET';
export const APPLY_ERROR = 'LeavesState/APPLY_ERROR';
export const APPLY_SUCCESS = 'LeavesState/APPLY_SUCCESS';
export const SHOW_PROGRESS = 'LeavesState/SHOW_PROGRESS';
export const APPLY_BUTTON_TOGGLE = 'LeavesState/APPLY_BUTTON_TOGGLE';
export const SHOW_NUMBER_OF_DAYS_PICKER = 'LeavesState/SHOW_NUMBER_OF_DAYS_PICKER';
export const UPDATE_FROM_DATE = "LeavesState/UPDATE_FROM_DATE";
export const UPDATE_TO_DATE = "LeavesState/UPDATE_TO_DATE";
export const NUMBER_OF_DAYS = "LeavesState/NUMBER_OF_DAYS";
export const PART_OF_DAY = "LeavesState/PART_OF_DAY";
export const USED_LEAVES = "LeavesState/USED_LEAVES";
export const REMAINING_LEAVES = "LeavesState/REMAINING_LEAVES";
export const UPDATE_PART_DAY_PICKER = "LeavesState/UPDATE_PART_DAY_PICKER";
export const UPDATE_FROM_DATE_PICKER = "LeavesState/UPDATE_FROM_DATE_PICKER";
export const UPDATE_TO_DATE_PICKER = "LeavesState/UPDATE_TO_DATE_PICKER";
export const BRIEF_MESSAGE = "LeavesState/BRIEF_MESSAGE";
export const PAID_UNPAID_LEAVE = "LeavesState/PAID_UNPAID_LEAVE";
export const PAID_UNPAID_PICKER = "LeavesState/PAID_UNPAID_PICKER";
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
    briefMessage: "",
    isPaidLeave: true,
    showPaidUnpaidPicker: false
});



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
    const dateText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return {
        type: UPDATE_FROM_DATE,
        payload: [date, dateText]
    }
}

export function updateToDate(date) {
    const dateText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
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

export function updatePaidUnpaid(leaveType) {
    //alert(leaveType)
    let isPaid = true;
    if (leaveType != "Paid Leave") {
        isPaid = false;
    }
    return {
        type: PAID_UNPAID_LEAVE,
        payload: isPaid
    };
}

export function updatePaidUnpaidPicker(showPicker) {
    return {
        type: PAID_UNPAID_PICKER,
        payload: showPicker
    }
}

export function updatePartOfDay(partOfDay) {

    return {
        type: PART_OF_DAY,
        payload: partOfDay
    }
}

export function updatePaidLeave(paidDay) {
    console.log("Chut " + paidDay)
    var isPaid = true;
    if (paidDay != "Paid Leave") {
        isPaid = false;
    }
    return {
        type: PAID_DAY,
        payload: isPaid
    }
}


export function toggleProgress(isProgress) {
    return {
        type: SHOW_PROGRESS,
        payload: isProgress
    };
}

export function updateNumberDaysPicker(isVisible) {
    return {
        type: SHOW_NUMBER_OF_DAYS_PICKER,
        payload: isVisible
    }
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


// Reducer
export default function LeavesStateReducer(state = initialState, action = {}) {
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

        case SHOW_NUMBER_OF_DAYS_PICKER:
            return state.set("showNumberOfDaysPicker", action.payload);


        case NUMBER_OF_DAYS:
            return state.set("isSingleDay", action.payload);

        case PART_OF_DAY:
            return state.set("partOfDay", action.payload);

        case USED_LEAVES:
            return state.set("usedLeaves", action.payload);

        case REMAINING_LEAVES:
            return state.set("remainingLeaves", action.payload);

        case UPDATE_PART_DAY_PICKER:
            return state.set("showPartOfDayPicker", action.payload);

        case UPDATE_FROM_DATE_PICKER:
            return state.set("showFromDatePicker", action.payload);

        case UPDATE_TO_DATE_PICKER:
            return state.set("showToDatePicker", action.payload);

        case BRIEF_MESSAGE:
            return state.set("briefMessage", action.payload);

        case PAID_UNPAID_LEAVE:
            return state.set("isPaidLeave", action.payload);

        case PAID_UNPAID_PICKER:
            return state.set("showPaidUnpaidPicker", action.payload);


        default:
            return state;
    }
}
