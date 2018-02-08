//import Platform from 'react-native';
import FCM from 'react-native-fcm';

export function scheduleCheckinNotification(platform, hours, mins) {
    var notificationTime = new Date();
    notificationTime.setHours(hours, mins, 0);
    var hoursInPm = hours
    var pmoram = "am"
    if (hours > 12 && hours <= 23) {
        hoursInPm = hours - 12
        pmoram = "pm"
    }
    //var hoursInPm = hours > 12 && hours <= 23 ? hours - 12 : hours
    

    console.log("gong to fcm ",platform);
    var displaymins = mins <= 9 ? "0" + mins : mins
    FCM.scheduleLocalNotification({
        //fire_date: notificationTime.toISOString(),
        fire_date: platform === 'ios'? notificationTime.toISOString() : notificationTime.getTime(),
        id: "checkinNotification",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
        body: "It's " + hoursInPm+ ":" + displaymins + " "+pmoram+ ". Please checkin.",
        repeat_interval: "day"
    });
}

export async function setCheckinNotification(platform, hours24hformat, mins24hformat, updated) {
    console.log("platform iss ",platform);
    if (platform === 'ios' || updated) {
        console.log("going to clear notification");
        FCM.cancelLocalNotification("checkinNotification")
    }

    FCM.getScheduledLocalNotifications().then((notifs)=>{
        console.log("already notifications ", notifs);
        if (notifs.length > 0) {
            var existing = notifs.filter((notif) => {
               return notif.id == "checkinNotification";
            });
            if (existing.length == 0) {
                console.log("successfully scheduled notification");
                scheduleCheckinNotification(platform, hours24hformat, mins24hformat);
            }
        } else {
            console.log("successfully scheduled notification1");
            scheduleCheckinNotification(platform, hours24hformat, mins24hformat);
        }
    }).catch((err)=>{
        console.log("notifications fetching error ",err);
    });
}