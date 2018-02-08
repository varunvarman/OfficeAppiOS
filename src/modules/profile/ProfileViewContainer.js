import {connect} from 'react-redux';
import ProfileView from './ProfileView';

export default connect(
    state => {
        return {
            username: state.get('username'),
            description: state.get('description'),
            hours: state.get('hours'),
            projects: state.get('projects')
        };
    }
)(ProfileView);