import * as api from '../utils/api';
import RealmDatabse from '../database/RealmDatabase';

let userName = RealmDatabse.findUser()[0];

export function setUserName(userName1) {
    userName = userName1;
}

export async function createUser(slackId, firstName, deviceToken, profileImage, email) {
    let userobj = {
        "slackId": slackId,
        "email": email,
        "firstName": firstName,
        "deviceToken": deviceToken,
        "profileImage": profileImage
    };
    try {
        const resp = await api.post("https://dc-office.herokuapp.com/api/v1/users", userobj, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function checkinUser() {

    let timelineObj = {
        user: userName.serverId,
        description: userName.name + " checked in successfully",
        type: "checkin"
    };
    try {
        const resp = await api.post("https://dc-office.herokuapp.com/api/v1/timelines", timelineObj, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function checkoutUser() {

    let timelineObj = {
        user: userName.serverId,
        description: userName.name + " checked out successfully",
        type: "checkout"
    };
    try {
        const resp = await api.post("https://dc-office.herokuapp.com/api/v1/timelines", timelineObj, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function getLastCheckinCheckout(type) {
    if (typeof userName != 'undefined' && typeof userName.serverId != "undefined") {
        try {
            const resp = await api.get("https://dc-office.herokuapp.com/api/v1/timelines?type=" + type + "&user=" + userName.serverId + "&limit=1&sort=createdAt DESC", true);
            return resp;
        }
        catch (error) {
            throw error;
        }
    }
}

export async function getUserTimeline() {
    try {
        const resp = await api.get("https://dc-office.herokuapp.com/api/v1/timelines?user=" + userName.serverId + "&&sort=createdAt DESC&limit=20&skip=" + 0, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function getLeaveHistory() {
    try {
        console.log("user name leave history is "+userName.serverId);
        let requestBody = {
            user: userName.serverId,
            sortBy: "from",
            sort_order: "-1"
        }
        const resp = await api.post("https://dc-office.herokuapp.com/api/cakehr/getHistory", requestBody, false)
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function getLeavesDetails() {
    try {
        const resp = await api.get("https://dc-office.herokuapp.com/api/cakehr/getUserDetails?user=" + userName.serverId, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function registerDevice(deviceToken, userID, deviceType) {

    let deviceObj = {
        user: userID,
        type: deviceType,
        firebaseDeviceToken: deviceToken
    };

    try {
        const resp = await api.post("http://dc-office.herokuapp.com/api/v1/devices", deviceObj, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function getAllUserstimelineforDay(date) {
    console.log(date + " THE DATE IS");
    try {
        const resp = await api.get("http://dc-office.herokuapp.com/api/v1/timelines/all-user-timeline?createdAt=" + date, true);
        console.log(resp);
        return resp;
    } catch (err) {
        throw err;
    }
}

export async function applyforLeave(cakeHrId, from, to, day_part, message, isPaid) {

    if (day_part === "First Half") {
        day_part = 1;
    } else if (day_part === "Second Half") {
        day_part = 2;
    } else {
        day_part = 0;
    }
    let timeoffString;
    if (isPaid) {
        timeoffString = "9931"
    } else {
        timeoffString = "10267"
    }

    let fromString = from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
    let toString = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
    let leaveBody;
    if ((fromString == toString) && ((day_part == 1) || (day_part == 2))) {
        console.log("inside");
        leaveBody = {

            "cakehr_id": cakeHrId,
            "timeoff_id": timeoffString,
            "from": fromString,//"2023-7-04",
            "to": toString,//"2023-7-04",
            "day_part": day_part,
            "hours": 4,
            "message": message
        };
    } else {
        console.log("outside");
        leaveBody = {
            "cakehr_id": cakeHrId,
            "timeoff_id": timeoffString,
            "from": fromString,//"2023-7-04",
            "to": toString,//"2023-7-04",
            "message": message
        };
    }
    try {
        const resp = await api.post("https://dc-office.herokuapp.com/api/cakehr/addtimeoff", leaveBody, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function applyforWfh(cakeHrId, from, to, day_part, message) {

    if (day_part === "First Half") {
        day_part = 1;
    } else if (day_part === "Second Half") {
        day_part = 2;
    } else {
        day_part = 0;
    }
    let fromString = from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
    let toString = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();

    let leaveBody;
    if ((fromString == toString) && ((day_part == 1) || (day_part == 2))) {
        console.log("inside");
        leaveBody = {

            "cakehr_id": cakeHrId,
            "timeoff_id": "10019",
            "from": fromString,//"2023-7-04",
            "to": toString,//"2023-7-04",
            "day_part": day_part,
            "hours": 4,
            "message": message
        };
    } else {
        console.log("outside");
        leaveBody = {
            "cakehr_id": cakeHrId,
            "timeoff_id": "10019",
            "from": fromString,//"2023-7-04",
            "to": toString,//"2023-7-04",
            "message": message
        };
    }
    try {
        const resp = await api.post("https://dc-office.herokuapp.com/api/cakehr/addtimeoff", leaveBody, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function adminUpdateCheckinCheckoutTime(userId, timelineId, type, createdAt) {

    let timelineObj = null;

    if (timelineId === null) {
        timelineObj = {
            createdAt: createdAt,
            user: userId,
            description: type + ' successfully',
            type: type
        };
        timelineId = "";
    } else {
        timelineObj = {
            createdAt: createdAt
        };
    }

    try {
        const resp = await api.post("http://dc-office.herokuapp.com/api/v1/timelines/" + timelineId, timelineObj, true);
        return resp;
    }
    catch (error) {
        throw error;
    }
}

export async function fetchOfficeLocationAPI() {
    try {
        const response = await api.get('http://dc-office.herokuapp.com/api/v1/gps', true);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateNewOfficeLocation(coordinates) {
    let ofcLocation = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        officeName: 'Landscape Town',
        city: 'Goa',
        radius: '500'
    };

    if (typeof userName != 'undefined' && typeof userName.officaLocationID != "undefined" && userName.officaLocationID !== "") {
        try {
            console.log('UPDATE OFFICE LOCATION: ' + JSON.stringify(ofcLocation));
            const response = await api.post('http://dc-office.herokuapp.com/api/v1/gps/' + userName.officaLocationID, ofcLocation, true);
            console.log('UPDATE OFFICE LOCATION RESPONSE: ' + JSON.stringify(response));
            return response;
        } catch(error) {
            console.log('UPDATE OFFICE LOCATION ERROR: ' + JSON.stringify(error));
            throw error;
        }
    }
}