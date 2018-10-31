import React, { Component } from 'react';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import Start from './start.js'
import PreStart from './preStart.js'
import session from './store/session/reducer.js'
import {View,Text,AsyncStorage} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

const middleware = [thunk]
export const store=createStore(session,applyMiddleware(...middleware))


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state={user:'none',token:null}
  }

  async componentDidMount() {
    SplashScreen.hide();
    this.checkPermission();
    this.createNotificationListeners();
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
  async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
  }

  async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  this.setState({token:fcmToken})
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
  }

  async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      this.getToken();
  } catch (error) {
      console.warn('permission rejected');
  }
  }


  async createNotificationListeners() {
  this.notificationListener = firebase.notifications().onNotification((notification:notification) => {
    notification.setSound('default')
        .android.setChannelId('test-channel')
        .android.setSmallIcon('ic_launcher');
    firebase.notifications()
        .displayNotification(notification);
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
  });


  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen:NotificationOpen) => {
    const notification: Notification = notificationOpen.notification;
   firebase.notifications().removeDeliveredNotification(notification.notificationId);
   });

  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
    }

  this.messageListener = firebase.messaging().onMessage((message) => {
    console.warn(JSON.stringify(message));
  });
  }

componentWillMount(){
  this.getUserId()
}
 getUserId = async () => {
  let userId = '';
  try {
    userId = await AsyncStorage.getItem('success') || 'none';
  } catch (error) {
    // Error retrieving data
    console.warn(error.message);
  }

  return this.setState({user:userId});
}

  render() {
    return (
     <Provider store={store}>
       <PreStart user={this.state.user}/>
     </Provider>

    );
  }
}
