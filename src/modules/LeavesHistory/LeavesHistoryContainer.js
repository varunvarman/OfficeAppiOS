import {connect} from 'react-redux';
import LeavesHistoryView from './LeavesHistoryView';

export default connect(
    function(state){
        return {
            leaveHistoryState: state.get('leaveHistoryState').toJS()
        };
})(LeavesHistoryView);