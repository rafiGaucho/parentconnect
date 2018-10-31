import React, {PropTypes} from 'react';
import {
  View,Text,Dimensions,TouchableOpacity,ActivityIndicator,
  StyleSheet,ImageBackground,TextInput,AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import Hr from "react-native-hr-component";
import {userLogin,saveUser} from './../store/session/actions.js'
import {schoolCode} from './../schoolCode.js'

const widthScreen= Dimensions.get('window').width/18;
const heightScreen= Dimensions.get('window').height/26;


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={userName:'',password:'',waiting:false}
  }
handleUserNameChange=(userName)=>{this.setState({userName:userName})}
handlePasswordChange=(password)=>{this.setState({password:password})}
handleLogin= async () =>{
  this.setState({waiting:true})
  let userId = '';
  try {
    fcmToken = await AsyncStorage.getItem('fcmToken');
  } catch (error) {
    // Error retrieving data
    console.warn(error.message);
  }
  user=this.state.userName;
  pass=this.state.password;
  fetch('http://test.ssdiary.com/ssdiary/parentApp/login.html?userName='+user+'&password='+pass+'&schoolCode='+schoolCode, {
        method: "POST",
        body: JSON.stringify(this.state.data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          return response.json();
        })
        .then(value => {
          this.setState({ data: value });
          this.props.saveUser(value);
          this.setState({waiting:false});
        }).then(()=>{if(this.state.data.success==true){this.props.userLogin(this.state.data,fcmToken)} else {alert(this.state.data.message)}});

}
  render() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'grey'}}>
        <ImageBackground source={require('./login.jpg')} style={{width: '100%', height: '100%',justifyContent:'flex-end'}} >
          <View style={{width:widthScreen*16,marginHorizontal:widthScreen,height:heightScreen*13,borderRadius:5,
            backgroundColor:'white',marginBottom:heightScreen,alignItems:'center',justifyContent:'center'}}>

          <View style={{flex:1,justifyContent:'flex-end'}}>
            <View style={{flexDirection:'row',alignItems:'center',marginLeft:widthScreen}}>
              <Icon name='user-o' type='FontAwesome' style={{color:'#0984e3'}}/>
              <TextInput placeholder='Username' placeholderTextColor='#7f8c8d'
                value={this.state.userName}
                onChangeText={this.handleUserNameChange}
              />
            </View>
            <Hr lineColor="#636e72" textPadding={0.001} hrStyles={{width:'90%',marginHorizontal:'5%',marginTop:-10}}/>
          </View>
          <View style={{flex:1,justifyContent:'center'}}>
            <View style={{flexDirection:'row',alignItems:'center',marginLeft:widthScreen}}>
              <Icon name='lock' type='SimpleLineIcons' style={{color:'#0984e3'}}/>
              <TextInput placeholder='Password' placeholderTextColor='#7f8c8d' secureTextEntry={true}
                value={this.state.password}
                onChangeText={this.handlePasswordChange}
              />
            </View>
            <Hr lineColor="#636e72" textPadding={0.001} hrStyles={{width:'90%',marginHorizontal:'5%',marginTop:-10}}/>
          </View>
          <View style={{flex:1,}}>
            <TouchableOpacity style={{width:widthScreen*12,height:heightScreen*2.5,borderRadius:heightScreen*1.25,
              backgroundColor:'#f1c40f',justifyContent:'center',alignItems:'center'}}
              onPress={this.handleLogin} >
              <Text style={{color:'white',fontWeight:'bold',fontSize:22,}}>Login</Text>
            </TouchableOpacity>
          </View>

          </View>
          {this.state.waiting && <View style={{height:heightScreen*28,width:'100%',position:'absolute',opacity:0.7,
          backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>}
        </ImageBackground>

      </View>
    );
  }
}
mapDispatchToProps={
userLogin:userLogin,saveUser:saveUser
}
mapStateToProps=(state)=>({
initialWindow:state.initialWindow
})
export default connect(mapStateToProps,mapDispatchToProps)(Login)
