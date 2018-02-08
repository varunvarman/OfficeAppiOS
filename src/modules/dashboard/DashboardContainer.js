import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {switchTab,pushRoute,popRoute, showLoading} from './DashboardState';
import {logoutSessionState} from '../session/SessionState';
import DashboardView from './DashboardView';

export default connect(
    state => ({
        dashboardState: state.get('dashboardState').toJS()
    }),
    dispatch => {
        return {
            popRoute: bindActionCreators(popRoute, dispatch),
            pushRoute: bindActionCreators(pushRoute, dispatch),
            switchTab: bindActionCreators(switchTab, dispatch),
            logoutUser: bindActionCreators(logoutSessionState, dispatch)
        };
    }
)(DashboardView);
