import {connect} from 'react-redux';
import AppView from './AppView';

export default connect(function(state){
    return {
      isReady: state.getIn(['session', 'isReady']),
      isLogin: state.getIn(['session', 'isLogin'])
    };
})(AppView);
