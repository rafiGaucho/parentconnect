import React, {PropTypes} from 'react';
import {
  View,ActivityIndicator,
  StyleSheet,WebView,AsyncStorage,BackHandler,TouchableOpacity,Text
} from 'react-native';
import PopupDialog,{slideAnimation} from 'react-native-popup-dialog';
import Hr from "react-native-hr-component";
import {userLogin,logoutUser} from './../store/session/actions.js'
import {connect} from 'react-redux';
import OfflineCacheWebView from 'react-native-offline-cache-webview';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={isLoading:false,check:true}
  }
componentDidMount(){
  BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillMount(){
    this.getUserId()
  }
componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
getUserId = async () => {
  let userId = '';
  let item=''
  try {
    userId = await AsyncStorage.getItem('userID') ;
    item=await AsyncStorage.getItem('isFirst')||'not'
    } catch (error) {
    console.warn(error.message);
    }
    this.setState({userID:userId});
    this.setState({isFirst:item})
    // alert(this.state.isFirst)
  }
handleBackPress = () => {
  this.popupDialog.show();
  return true;
  }
logout=()=>{
this.props.logoutUser();
BackHandler.exitApp();
}

exit=()=>{BackHandler.exitApp();}

cancel=()=>{  this.popupDialog.dismiss();}
handleError=()=>{
  return (
    <View style={{alignItems:'center',justifyContent:'center',height:'100%',width:'100%'}}>
      <Text style={{fontSize:18}}>unable to load .. check your network</Text>
    </View>
  );
}
update=()=>{
  if(this.state.isFirst == 'not'){
    setTimeout(() => {this.setState({check:false})}, 5000)
    setTimeout(() => {this.setState({check:true})}, 7000)
    AsyncStorage.setItem('isFirst', 'blablabla');
    this.setState({isFirst:''})
  }

}
loadStart=()=>{this.setState({isLoading:true})}
loadEnd=()=>{this.setState({isLoading:false})}
  render() {
    return (
      <View style={{height:'100%',width:'100%'}}>

        {this.state.isLoading && <View style={{alignItems:'center',justifyContent:'flex-end',height:'100%',width:'100%',position:'absolute'}}>
            {/* <ActivityIndicator size="small"  /> */}
            <Text style={{fontSize:20,fontWeight:'bold',marginBottom:'10%'}}>fetching ...</Text>
        </View>}
        {this.state.check && <WebView startInLoadingState={true} onLoad={this.update}
          onLoadStart={this.loadStart} onLoadEnd={this.loadEnd} onError={this.handleError}
               source={{uri: 'https://parentapp-a4061.firebaseapp.com/'+this.state.userID}}
               style={{flex:1}}
             />}

             <PopupDialog
               ref={(popupDialog) => { this.popupDialog = popupDialog; }}
              dialogAnimation={slideAnimation} dismissOnTouchOutside={false}
              height={0.4} width={0.6} containerStyle={{paddingBottom:'35%',}} dialogStyle={{}} >
              <View style={{flex:1,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                {/* {alert(this.state.userID)} */}
                <MessagePopUp logout={this.logout} exit={this.exit} cancel={this.cancel}/>
              </View>
             </PopupDialog>

      </View>

      );
  }
}



const MessagePopUp=(props)=>{
  return (
    <View style={{flex:1,backgroundColor:'#40739e',borderRadius:5}}>
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={props.logout}>
        <Text style={{color:'#e84118',fontWeight:'bold',fontSize:22}}>Logout</Text>
      </TouchableOpacity>
      </View>
      <Hr lineColor="#353b48" textPadding={0.001} hrStyles={{width:'88%',marginHorizontal:'6%'}}/>
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={props.exit}>
          <Text style={{color:'orange',fontWeight:'bold',fontSize:22}}>Exit</Text>
        </TouchableOpacity>
      </View>
      <Hr lineColor="#353b48" textPadding={0.001} hrStyles={{width:'88%',marginHorizontal:'6%'}}/>
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={props.cancel}>
          <Text style={{color:'#4cd137',fontWeight:'bold',fontSize:22}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
mapDispatchToProps={
logoutUser:logoutUser
}

export default connect(null,mapDispatchToProps)(Home)
