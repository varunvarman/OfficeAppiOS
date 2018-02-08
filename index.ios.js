import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppViewContainer from './src/modules/AppViewContainer';

import React, {Component} from 'react';
import {AppState, AppRegistry, Platform,Alert} from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import RealmDatabse from './src/database/RealmDatabase';
import * as officeApi from './src/office-server/OfficeApi';

class DietcodeApp extends Component {
  componentDidMount() {
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        console.log("ios notification",JSON.stringify(notif));
        console.log("payload ",notif.notification)
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if (notif.fcm) {
            Alert.alert(
                notif.fcm.title,
                notif.fcm.body,
                [
                    {text: 'OK', onPress: () => console.log('Ok Pressed')},
                ],
                { cancelable: false }
            );
        } else if (notif.aps && notif.aps.alert && !notif.opened_from_tray) {
              console.log("push notificaiton else")
              if (AppState.currentState === 'active') {
                Alert.alert(
                    notif.aps.alert.title,
                    notif.aps.alert.body,
                    [
                        {text: 'OK', onPress: () => console.log('Ok Pressed')},
                    ],
                    { cancelable: false }
                );
              }
        }
        if(notif.local_notification && !notif.opened_from_tray){
          //this is a local notification
          console.log("local notification if1")
          if (AppState.currentState === 'active') {
            alert(notif.body)
          }
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
        console.log("firebase token refreshed fcm crash",token, "user ",RealmDatabse.findUser())
        if (typeof RealmDatabse.findUser()[0] != 'undefined' && typeof RealmDatabse.findUser()[0].serverId != 'undefined') {
            if (typeof token != 'undefined') {
                officeApi.registerDevice(token, RealmDatabse.findUser()[0].serverId, Platform.OS).then((resp) => {
                    //alert("register device response "+ JSON.stringify(resp));
                })
                .catch((error)=>{
                    // alert("error : "+error);
                });
            }
        }
        // fcm token may not be available on first load, catch it here
    });
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
