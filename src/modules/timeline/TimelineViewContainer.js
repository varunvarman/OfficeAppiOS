import {connect} from 'react-redux';
import TimelineView from './TimelineView';

export default connect(
    function(state){
        return {
            timeLineState: state.get('timelineState').toJS(),
            officeLocation: state.getIn(['settingsState', 'officeLocation']).toJS()
        };
    })(TimelineView);
