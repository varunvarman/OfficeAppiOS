import {connect} from 'react-redux';
import LoginView from './LoginView';

export default connect(
    function(state){
       return {
           showProgress: state.getIn(["loginState","showProgress"]),
           errorMessage: state.getIn(["loginState","errorMessage"]),
           successMessage: state.getIn(["loginState","successMessage"]),
           showLoginButton: state.getIn(["loginState","showLoginButton"])
       };
    })(LoginView);
//     state => ({
//         showProgress: state.get(["loginState","showProgress"])
//         //navigationState: state.get('navigationState').toJS()
//     })
// )(LoginView);
