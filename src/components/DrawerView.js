import React, {PropTypes, Component} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class DrawerView extends Component {
  static displayName = 'TabBarButton';

  static propTypes = {
    pushRoute: PropTypes.func.isRequired
  };

  render() {
    return (
      <View style={styles.oneRow}>
        <View style={{height:50}}>
          <TouchableOpacity
              style={{flex:1,flexDirection:"row"}}
              onPress={()=>{
            this.props.closeFunction.close();
            setTimeout(()=> {
               this.props.pushRoute({key: 'SettingsTab', title: 'Settings'});
            }, 300);

        }}
          >
            <Icon
                style={{alignSelf:"center"}}
                size={20}
                color='#888'
                name="gear"
            />
            <Text style={{color:"#888",alignSelf:"center",marginLeft:20,fontSize:18}}>Settings</Text>
          </TouchableOpacity>
          </View>

        <View style={{height:1,backgroundColor:"#eee"}}></View>

        <View style={{height:50}}>
          <TouchableOpacity
              style={{flex:1,flexDirection:"row"}}
              onPress={()=>{
            this.props.closeFunction.close();
            setTimeout(()=> {
               this.props.pushRoute({key: 'AboutUsTab', title: 'About Us'});
            }, 300);
        }}
          >
            <Icon
                style={{alignSelf:"center"}}
                size={20}
                color='#888'
                name="info-circle"
            />
            <Text style={{color:"#888",alignSelf:"center",marginLeft:20,fontSize:18}}>About Us</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selected: {
    opacity:1,
    backgroundColor: '#ddd'
  },
  oneRow:{
    padding:10,
    flex:1,
    flexDirection:"column",
    backgroundColor:"#fff"
  }
});

export default DrawerView;
