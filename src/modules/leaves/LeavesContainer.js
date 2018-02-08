import {connect} from 'react-redux';
import LeavesView from './LeavesView';
import {toJS} from 'immutable';

export default connect(
    state => ({
        LeavesState: state.get("leavesState").toJS()

    })
)(LeavesView);