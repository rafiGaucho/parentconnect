import {View,StyleSheet,Alert,TouchableOpacity,TextInput,Text,AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase';

export const userLogin=(data1,data2)=>{
return (dispatch)=>{
      dispatch({type:'loggingEnable'});
      firebase.database().ref('users').child('009').child(data1.parent.id).set({token:data2})
    }
  }

// export const logoutUser = () => {
//   return (dispatch) => {
//         dispatch({type:'logoutUser'})
// }}
export const getUser = (userId) => {
  return (dispatch) => {
        dispatch({type:'getUser',userString:userId})
}}

export const saveUser = (data) => {
  return (dispatch) => {
        saveUserId(data)
        dispatch({type:'saveUser',userString:data})
        alert(data.message)
}}
export const logoutUser = () => {
  return (dispatch) => {
        dispatch({type:'logoutUser',})
        removeItemValue('success');
        removeItemValue('userID');
}}





getUserId = async () => {
 let userId = '';
 try {
   userId = await AsyncStorage.getItem('success') || 'none';
   return userId;
 } catch (error) {
   // Error retrieving data
   console.warn(error.message);
 }

}

const saveUserId = data => {
     AsyncStorage.setItem('success', JSON.stringify(data.success));
     AsyncStorage.setItem('userID',JSON.stringify(data.parent.id));
};
const removeItemValue= async key => {
   try {
     await AsyncStorage.removeItem(key);
     return true;
   }
   catch(exception) {
     return false;
   }
 }
