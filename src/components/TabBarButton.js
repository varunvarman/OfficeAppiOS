import React, {PropTypes, Component} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class TabBarButton extends Component {
  static displayName = 'TabBarButton';

  static propTypes = {
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired
  };

  setIcon = (iconName) => {
    switch (iconName){
      case "Dashboard":
            return "dashboard";
      case "Profile":
        return "user";
      case "Leaves":
        return "gamepad";
      case "Wfh":
        return "home";
      default:
        return "dashboard";
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={[styles.button,this.props.isSelected && styles.selected]}
        >
        <Icon
            size={20}
            color='#888'
            name={this.setIcon(this.props.text)}
        /><Text>{this.props.text}</Text>
      </TouchableOpacity>
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
  }
});

export default TabBarButton;
