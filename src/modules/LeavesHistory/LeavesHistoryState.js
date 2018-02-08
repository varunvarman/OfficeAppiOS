import {fromJS} from 'immutable';
export const LEAVEHISTORY_DATA = 'LeavehistoryState/LEAVEHISTORY_DATA';
export const LEAVEHISTORY_TYPE = 'LeavehistoryState/LEAVEHISTORY_TYPE';

const initialState = fromJS({
    leaveHistoryData: {
        data : []
    },
    leaveHistoryType: ""
});

export function setLeaveHistoryData(data) {
    return {
        type: LEAVEHISTORY_DATA,
        payload: data
    };
}

export function setLeaveHistoryType(data) {

    console.log("goint foooo",data)
    return {
        type: LEAVEHISTORY_TYPE,
        payload: data
    }
}

export default function LHStateReducer(state = initialState, action = {}) {
    console.log("setting type to ", action.type);
    switch (action.type) {
        case LEAVEHISTORY_DATA:
            console.log("setting leave history data");
            return state.set("leaveHistoryData",action.payload);
        case LEAVEHISTORY_TYPE:
            console.log("setting leave history type");
            return state.set("leaveHistoryType",action.payload);
        default:
            return state;
    }
}