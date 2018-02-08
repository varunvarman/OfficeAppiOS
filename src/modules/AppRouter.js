/*eslint-disable react/prop-types*/

import React from 'react';
import CounterViewContainer from './counter/CounterViewContainer';
import ColorViewContainer from './colors/ColorViewContainer';
import {Text,View} from 'react-native';
import WfhContainer from './wfh/WfhContainer'
import AboutUsView from '../components/AboutUsView'
import TimeLineView from './timeline/TimelineView'
import TimeLineContainer from './timeline/TimelineViewContainer'
import AdminDashboardController from './admin_dashboard/AdminDashboardController'
import LeavesContainer from './leaves/LeavesContainer'
import SettingsViewContainer from './settings/SettingsViewContainer'
import * as wfh from './wfh/WfhView'
import ProfileView from './profile/ProfileView';
import LeavesHistoryContainer from './LeavesHistory/LeavesHistoryContainer'
import * as LHView from './LeavesHistory/LeavesHistoryView'

/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */

export default function AppRouter(props,pushRoute) {
  const key = props.scene.route.key;

  if (key === 'DashboardTab') {
    return <TimeLineContainer pushRoute = {pushRoute} />;
  }else if (key === 'ProfileTab') {
    return <ProfileView />;
  }else if (key === 'LeavesTab') {
    return <LeavesContainer pushRoute = {pushRoute} />;
  }else if (key === 'WorkFromHomeTab') {
      return <WfhContainer pushRoute = {pushRoute} />;
  }else if (key === 'LeavesHistoryTab') {
    return <LeavesHistoryContainer/>;
  } else if (key === 'AdminDashboardTab') {
    return <AdminDashboardController />;
  }else if (key === 'SettingsTab') {
    return <SettingsViewContainer pushRoute = {pushRoute} />;
  }else if (key === 'AboutUsTab') {
    return <AboutUsView pushRoute = {pushRoute} />;
  }

  if (key.indexOf('ProfileTab') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
      <ColorViewContainer
        index={index}
      />
    );
  }
  if (key.indexOf('LeavesTab') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ColorViewContainer
            index={index}
        />
    );
  }
  if (key.indexOf('WorkFromHomeTab') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ColorViewContainer
            index={index}
        />
    );
  }
  if (key.indexOf('AdminDashboardTab') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ColorViewContainer
            index={index}
        />
    );
  }
    if (key.indexOf('LeavesHistoryTab') === 0) {
        const index = props.scenes.indexOf(props.scene);
        return (
            <ColorViewContainer
        index={index}
        />
    );
    }
  throw new Error('Unknown navigation key: ' + key);

}
