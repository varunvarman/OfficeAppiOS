import {connect} from 'react-redux';
import WfhView from './WfhView';
import {toJS} from 'immutable';

export default connect(
    state => ({
        wfhState: state.get("wfhState").toJS()
    })
)(WfhView);