import React, { PropTypes, Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';

class AboutUsView extends Component {

  static displayName = 'AboutUsView';

  static propTypes = {
    navigationStateActions: PropTypes.shape({
      pushRoute: PropTypes.func.isRequired
    })
  };


  render() {
    return (
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        <Image
          source={require('../../images/mountain.jpg')}
          resizeMode="cover"
          style={styles.header}>
        </Image>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}
          style={styles.scrollView}>
          <Image
            source={require('../../images/dietcodelogo.png')}
            style={styles.logo}>
          </Image>
          <Text style={styles.plainText}>
            Version 1.0.4
      </Text>
          <Text style={styles.plainText}>
            🔥 Diet Code 🔥
       </Text>
          <Text style={styles.descriptionText}>
            The technology used in this app making is 99% React Native, 1% Native (Java & Swift)
         </Text>
          <Text style={styles.geekPlainText}>
            Geeked By 🤓 :
       </Text>
          <Text style={styles.namePlainText}>
            Ankit
         </Text>
          <Text style={styles.namePlainText}>
            Divyanshu
       </Text>
          <Text style={styles.namePlainText}>
            Naveen
       </Text>
          <Text style={styles.namePlainText}>
            Varun Varman
       </Text>
          <Text style={styles.namePlainText}>
            Vishnu Vardhan
      </Text>
          <Text style={styles.geekPlainText}>
            Server Geeked By 🤓 :
       </Text>
        <Text style={styles.namePlainText}>
          Arun
         </Text>
          <Text style={styles.namePlainText}>
         Santosh
       </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center'
  },
  plainText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: null,
    height: null,
    backgroundColor: "transparent"
  },
  geekPlainText: {
    alignSelf: 'center',
    marginTop: 20,
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  namePlainText: {
    alignSelf: 'center',
    color: "white",
    fontSize: 14,
  },
  descriptionText: {
    color: "white",
    textAlign:"center",
    fontSize: 14,
    fontWeight: "normal",
    marginTop: 20
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center'
  },
  scrollView: {
    backgroundColor: 'transparent',
    height: 850,
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  }
});

export default AboutUsView;