




import React, {Component} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Constants, WebBrowser } from 'expo';
import RootTabs from './mainNavigator';
import RootNavigator from './stackNavigator';
//import { EventRegister } from 'react-native-event-listeners';

export default class App extends React.Component {
  constructor(props) {
        super(props)
        
        this.state = {
            result:null,
        }
    }


  render() {
    if (!this.state.result) {
      return (
        <View style={styles.container}>
          <Text> Welcome to the app. Please authenticate your profile </Text>
          <Button title="Open Auth" onPress={this._handlePressAsync} />
          {this.state.result ? (
            <Text>{JSON.stringify(this.state.result)}</Text>
          ) : null}
          </View>
      );
    }
    else if(this.state.result === "lauchagnr"){ //Manejar los menues dependiendo el usuario
      return <RootNavigator/>;
    }
  }


  //Usar el nombre de usuario desde /user para controlar quien está autenticado
  _handlePressAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://frozen-everglades-78768.herokuapp.com/login/');
    while (true){
      await fetch(
        'https://frozen-everglades-78768.herokuapp.com/user/'
      ).then((response) => response.json())
      .then((responseJson) => {
        //console.log("Json response: "+responseJson);
        if (responseJson.usuario.cont != ""){ //Si el usuario se pudo autenticar
          WebBrowser.dismissBrowser();
          this.setState({ result: responseJson.usuario.cont });  
        }
      })
      .catch((error) => {
        console.error(error);
      });
      if(this.state.result != null){
        break;
      }
    }

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:Constants.statusBarHeight,
  },
});