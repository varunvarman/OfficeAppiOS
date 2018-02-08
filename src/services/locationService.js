//"use_strict";
import {
    Platform
} from 'react-native';

var officeLocation = {
    lat: 15.4561103,
    long: 73.8222992
};

const expectedRange = 200; // meters

var locationServiceOptions = {
    enableHighAccuracy: Platform.OS === 'ios'? true:false,
    timeout: 5000,
    maximumAge: 2000
};

function getDistanceBetween(locationOne, locationTwo) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(locationTwo.lat-locationOne.lat);  // deg2rad below
  var dLon = deg2rad(locationTwo.long-locationOne.long);
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(locationOne.lat)) * Math.cos(deg2rad(locationTwo.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000; // Distance in meters.
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function fetchLocation(success, failure) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            let pos = JSON.stringify(position);
            //console.log('LOCATION SERVICE FOUND LOCATION: ' + pos);
            let currentPosition = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            success(currentPosition);
        }, 
        (error) => {
            //console.log('ERROR IN FINDING LOCATION: CODE: ' + error.code + ' MESSAGE: ' + error.message);
            failure(error);
        }, 
        locationServiceOptions);
}

// Method handles both callbacks and Promises (if arguments not passed in)
export function isUserValidLocation(officePos, validity, err) {
    //console.log('ARGUMETS: ' + arguments.length);
    if (typeof officePos == 'undefined') {
        // console.log('RETURNED NULL');
        return null;
    }
    if (arguments.length === 3) {
        fetchLocation((coordinates) => {
            var distance = getDistanceBetween(coordinates, officePos);
            distance = Math.trunc(distance);
            (distance <= expectedRange ? validity(true) : validity(false));
        }, 
        (error) => {
            err(error);
        });
    } else {
        return new Promise((resolve, reject) => {
            fetchLocation((coordinates) => {
                var distance = getDistanceBetween(coordinates, officePos);
                // console.log('OFFICE POS ' + JSON.stringify(officePos));
                distance = Math.trunc(distance);
                (distance <= expectedRange ? resolve(true) : resolve(false));
            },
            (error) => {
                reject(error);
            });
        });
    }
}