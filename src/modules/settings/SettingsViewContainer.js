import { connect } from 'react-redux';
import SettingsView from './SettingsView';
import { toJS } from 'immutable';

export default connect(
    (state) => ({
        settingsState: state.get('settingsState').toJS()
    })
)(SettingsView);