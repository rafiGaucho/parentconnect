import React ,{Component} from 'react';
import {connect} from 'react-redux';
import Auth from './Auth'
import {
  View,
  StyleSheet,AsyncStorage
} from 'react-native';
import Home from './Home'
import {getUser,saveUser} from './store/session/actions.js'




class Start extends Component{
  constructor(props) {
    super(props);
    this.state={}
  }


render(){

    if(this.props.logged == true||this.props.user =='true')
      {  return(
        <Home />
      )       }
    else {
      return(<Auth /> ) }

    }
   }



mapDispatchToProps={
  getUser:getUser
}
mapStateToProps=(state)=>({
  logged:state.logged,useR :state.user ,userString:state.userString
})

export default connect(mapStateToProps,mapDispatchToProps)(Start)
