import React, { Component } from 'react';
import {
  View,
  StyleSheet,Text,TouchableOpacity,Linking,NetInfo
} from 'react-native';
import firebase from 'react-native-firebase';
import PopupDialog,{slideAnimation} from 'react-native-popup-dialog';
import {version} from './version.js'
import Start from './start.js'

export default class PreStart extends React.Component {
  constructor(props) {
    super(props);
    this.state={}
  }

  componentDidMount(){
    NetInfo.getConnectionInfo().then((connectionInfo) => {
       if(connectionInfo == 'cellular'||'wifi'){
        firebase.config().fetch(0)
        .then(() => {
          return firebase.config().activateFetched();
          })
        .then((activated) => {
          if (!activated) console.log('Fetched data not activated');
          return firebase.config().getValue('force_update_current_version');
          })
        .then((snapshot) => {
          this.setState({value:snapshot.val()})
          if(snapshot.val() != version){
          this.popupDialog.show(); }

          })
        .catch(this.setState({value:version}));
      }
    else  if(connectionInfo == 'unknown'|| 'none'){
        this.setState({value:version})
      }

    });

  }
  handle=()=>{
    firebase.config().fetch()
    .then(() => {
      return firebase.config().activateFetched();
      })
    .then((activated) => {
      if (!activated) console.log('Fetched data not activated');
      return firebase.config().getValue('force_update_store_url');
      })
    .then((snapshot) => {
      Linking.openURL(snapshot.val());
      })
    .catch(console.error);

  }

  render() {
    if(this.state.value != version )
    return (
          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
           dialogAnimation={slideAnimation} dismissOnTouchOutside={false}
           height={0.3} width={0.9} containerStyle={{}} dialogStyle={{}} >

           <View style={{flex:1,backgroundColor:'#40739e',borderRadius:5,backgroundColor:'white'}}>
             <View style={{flex:1,marginLeft:'5%',justifyContent:'center'}}>
               <Text style={{fontSize:22,fontWeight:'bold',color:'#34495e'}}>New version available</Text>
             </View>
             <View style={{flex:1,marginLeft:'5%',justifyContent:'center'}}>
               <Text style={{fontSize:18,fontWeight:'600'}}>please,update to new version</Text>
             </View>
             <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',marginRight:'5%'}}>
               <TouchableOpacity onPress={this.handle}>
                 <Text style={{fontSize:20,color:'#27ae60',fontWeight:'bold'}}>UPDATE</Text>
               </TouchableOpacity>
             </View>
           </View>

          </PopupDialog>
    );
    else {
      return (
        <Start user={this.props.user}/>
      );
    }
  }
}
