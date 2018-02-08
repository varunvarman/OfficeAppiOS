import {Map, fromJS} from 'immutable';
import {loop, combineReducers} from 'redux-loop';
import NavigationStateReducer from '../modules/navigation/NavigationState';
import CounterStateReducer from '../modules/counter/CounterState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';
import LoginStateReducer from '../modules/login/LoginState';
import DashboardStateReducer from '../modules/dashboard/DashboardState';
import WfhStateReducer from '../modules/wfh/WfhState'
import LHstateReducer from '../modules/LeavesHistory/LeavesHistoryState'
import TimelineStateReducer from '../modules/timeline/TimelineState';
import LeavesStateReducer from '../modules/leaves/LeavesState';
import SettingsViewReducer from '../modules/settings/SettingsState';
import AdminDashboardStateReducer from '../modules/admin_dashboard/AdminDashboardState';


const reducers = {
    // Counter sample app state. This can be removed in a live application
    counter: CounterStateReducer,

    // @NOTE: By convention, the navigation state must live in a subtree called
    //`navigationState`
    navigationState: NavigationStateReducer,

    session: SessionStateReducer,

    loginState: LoginStateReducer,

    dashboardState: DashboardStateReducer,

    wfhState: WfhStateReducer,
    
    leavesState: LeavesStateReducer,

    timelineState: TimelineStateReducer,

    settingsState: SettingsViewReducer,

    adminDashboardState: AdminDashboardStateReducer,

    leaveHistoryState: LHstateReducer

};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
    reducers,
    immutableStateContainer,
    getImmutable,
    setImmutable
);

export default function mainReducer(state, action) {
    const [nextState, effects] = action.type === RESET_STATE
        ? namespacedReducer(action.payload, action)
        : namespacedReducer(state || void 0, action);

    // enforce the state is immutable
    return loop(fromJS(nextState), effects);
}
