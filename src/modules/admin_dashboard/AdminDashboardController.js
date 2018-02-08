import {connect} from 'react-redux';
import AdminDashboardView from './AdminDashboardView';

export default connect(
    function(state){
        return {
            adminDashboardState: state.get("adminDashboardState").toJS()
        };
})(AdminDashboardView);
