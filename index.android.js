import 'es6-symbol/implement';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppViewContainer from './src/modules/AppViewContainer';
import React, {Component} from 'react';
import {AppState, AppRegistry, BackAndroid, Platform, PermissionsAndroid,Alert} from 'react-native';
import * as NavigationStateActions from './src/modules/dashboard/DashboardState';
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import RealmDatabse from './src/database/RealmDatabase';
import * as officeApi from './src/office-server/OfficeApi';
import {fromJS} from 'immutable';
let listener = null
class DietcodeApp extends Component {

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.navigateBack);
        this.askAndroidLocationPermissions();
    }

    componentDidMount() {
        FCM.getFCMToken().then(token => {
            console.log(token);
            // store fcm token in your server
        });
        this.notificationListener = FCM.on(FCMEvent.Notification, async(notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if (notif.fcm && (notif.fcm.title || notif.fcm.body)) {
                console.log("going to show fcm notification android ",notif);
                Alert.alert(
                    notif.fcm.title,
                    notif.fcm.body,
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => console.log('Ok Pressed')},
                    ],
                    { cancelable: false }
                )
            }
            if (notif.local_notification) {
                if (AppState.currentState === 'active') {
                    console.log("going to show local notification android");
                    alert(notif.body)
                }
                //this is a local notification
            }
            if(notif.opened_from_tray){
              //app is open/resumed because user clicked banner
            }
            if(Platform.OS ==='ios'){
              //optional
              //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
              //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
              //notif._notificationType is available for iOS platfrom
              switch(notif._notificationType){
                case NotificationType.Remote:
                  notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                  break;
                case NotificationType.NotificationResponse:
                  notif.finish();
                  break;
                case NotificationType.WillPresent:
                  notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                  break;
              }
            }
        });
         this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            //console.log(token)
            //console.log("firebase token refreshed",token, "user data ", RealmDatabse.findUser()[0])
          if (typeof RealmDatabse.findUser()[0] != 'undefined' && typeof RealmDatabse.findUser()[0].serverId !== 'undefined') {
              if (typeof token != 'undefined') {
                  officeApi.registerDevice(token, RealmDatabse.findUser()[0].serverId, Platform.OS)
              }
          }
        });
  }
  componentWillUnmount() {
      // stop listening for events
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
  }

   askAndroidLocationPermissions() {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
            (status) => {
                // Status of permission
                if (!status) {
                    // request for location permission
                    this.getAndroidLocationPermissions();
                }
            }
        ).catch(
            (error) => {
                // error occoured
                console.log('SOME ERROR OCCOURED DURING THE CHECKING OF PERMISSIONS. ' + JSON.stringify(error));
            }
            );
    }

    async getAndroidLocationPermissions() {
        try {
            const permissionStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'DietCodeApp requires Location Permission',
                    'message': 'DietCodeApp requires you to provide access to your location for conducting checkin/checkout.'
                }
            )
            if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Android: Geolocation Permission Granted");
            } else {
                console.log("Android: Geolocation Permission Denied");
                Alert.alert(
                    'Oh! Well',
                    'You may not be able to checkin/checkout, until you provide the permission to access your location, you can change this later in settings.',
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                );
            }
        } catch (error) {
            console.log('SOME ERROR OCCOURED DURING THE REQUESTING OF PERMISSIONS: ' + JSON.stringify(error));
            Alert.alert(
                'Oh! Snap',
                'Some location services error occoured, try again later.',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
    }

  navigateBack() {
    const navigationState = store.getState().get('dashboardState');
    const tabs = navigationState.get('tabs');
    const tabKey = tabs.getIn(['routes', tabs.get('index')]).get('key');
    const currentTab = navigationState.get(tabKey);
    // if we are in the beginning of our tab stack

    if (currentTab.get('index') === 0) {
      return false;
    }
    store.dispatch(NavigationStateActions.popRoute());
    return true;
  }

  render() {
    return (
      <Provider store={store}>
        <AppViewContainer />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('DietcodeApp', () => DietcodeApp);
