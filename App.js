import React from 'react';
import { View, WebView, Dimensions,Text,Component, Button, StatusBar,StyleSheet, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigator } from 'react-navigation';
//import LoginNavigator from './loginNavigator';
import {WebBrowser,Constants } from 'expo';
import { TabNavigator } from 'react-navigation';
import { Header } from 'react-native-elements';

//import AppNavigator from './loginNavigator';
//import RootTabs from './mainNavigator';
import ImageBrowser from './ImageBrowser';
import FormTermo from './FormTermo';
//import RNFetchBlob from 'react-native-fetch-blob'

/*//Cada componente registrado en un navigator debera tener una prop navigation, que determina como se mueve entre las screens
 const HomeScreen = ({ navigation }) => ( //Stateless function
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      onPress={() => navigation.navigate('Profile')} //Para moverse de una screen a otra
      title="Go to login"
    />
        <Button
      onPress={() => navigation.goBack(null)} //Para moverse de una screen a otra
      title="Go to login"
    />
  </View>
);*/

class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
           result:null
         };
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    handleChildUnmount(){
        this.setState({result: null});
    }
/*
  static navigationOptions = ({ navigation }) => ({
      headerTitle: 'Home',
      headerStyle: {
        backgroundColor:'black',
      },
      headerTintColor:'orange',
      //headerRight: <Button title='Logout' onPress={() =>{ fetch('https://frozen-everglades-78768.herokuapp.com/logout'); navigation.navigate('Home2'); }} />,
      //headerVisible: false
    });

/*
      headerRight: <Button onPress={() => {fetch('https://frozen-everglades-78768.herokuapp.com/logout'); this.setState({result:null});}
  } //Ver BackHandler --- Por ahora el log out solo borra el valor en /user
  title="Log out" />
  };

  handleLogOut(){
    fetch('https://frozen-everglades-78768.herokuapp.com/logout');
    this.setState({result:null})
  }
  componentWillMount(){
    this.props.navigation.setParams({isHeaderShow: false});
  }*/

  render() { //Cmabiar la logica del back, que al hacer back se desloguee
      const { navigate } = this.props.navigation;
      if (!this.state.result) {

        return (
            <WebView
                source={{uri: 'https://termoslp.herokuapp.com/login/'}}
                 onNavigationStateChange={async(e) => {
                  console.log("----Volvio del web view");
                      while (true){
                        await fetch(
                          'https://termoslp.herokuapp.com/user/'
                        ).then((response) => response.json())
                        .then((responseJson) => {
                          //console.log("Json response: "+responseJson);
                          if (responseJson.usuario.cont != ""){ //Si el usuario se pudo autenticar
                            console.log("-----Entra al handle async");
                            this.setState({ result: responseJson.usuario.app });  
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                        if(this.state.result != null){
                          break;
                        }
                      }
                    /*if (e.url == "https://frozen-everglades-78768.herokuapp.com/"){
                        console.log("----"+Object.keys(this.webView)+" "+e+" "+e.url);
                        this.webView.stopLoading();  // <---- Add a similar line
                      }*/
                }}
                ref={(webView) => this.webView = webView}            
            />
       

        );
      }
      else if(this.state.result === "lauchagnr"){ //Manejar los menues dependiendo el usuario
        //console.log(this.props.navigation+" "+navigate)
        return (
          <View style={{ flex: 1}}>
            <StatusBar
             backgroundColor='#ffa500' barStyle='light-content'
           />
            <App unmountMe={this.handleChildUnmount} /> 
          </View>
        ); //return <RootNavigator/>;
      }
  }
}
/*
  //Usar el nombre de usuario desde /user para controlar quien está autenticado
  _handlePressAsync = async() =>{
    console.log("----Volvio del web browser");
    while (true){
      await fetch(
        'https://frozen-everglades-78768.herokuapp.com/user/'
      ).then((response) => response.json())
      .then((responseJson) => {
        //console.log("Json response: "+responseJson);
        if (responseJson.usuario.cont != ""){ //Si el usuario se pudo autenticar
          console.log("-----Entra al handle async");
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
    //this.refs[WEBVIEW_REF].stopLoading();  // <---- Add a similar line
    //This will tell your webView to stop processing the clicked link

    return false;

  }
}

 const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);
*/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBrowserOpen: false,
      photos: [],
      selectedPhotos:false,
      message:""
    }
  }

  static navigationOptions: {
      headerTitle: 'Home',
      headerStyle: {
        backgroundColor:'black',
      },
      headerTintColor:'orange'
    
  };

  dismiss = async() => {
      console.log("entra a dismiss")
      await fetch('https://termoslp.herokuapp.com/logout?username=lauchagnr').then((response) => {
        this.props.unmountMe();
      });
  }

  imageBrowserCallback = async (callback) => {
    callback.then(async(photos) => {
      console.log("Info de las fotos: ",photos)
      this.setState({
        imageBrowserOpen: false,
        photos:photos
      });
      console.log("----length photos",photos.length);
      if(photos.length > 0){
        await fetch('https://termoslp.herokuapp.com/access_token?username=lauchagnr').then((response) =>{
          console.log("----Code response ",response,response.status);
          if (response.status != 201){
            WebBrowser.openBrowserAsync('https://termoslp.herokuapp.com/drive/?username=lauchagnr').then((result)=>{          
              WebBrowser.dismissBrowser();
              console.log("llama con photos" + photos);
            });
          }
          this.setState({selectedPhotos:true}); //Actualizo el selectedPhotos                  
        }); 
      }else{
        this.setState({message:""});//Vuelvo a actualizar selectedPhotos
      }   
    }).catch((e) => console.log(e))
  }

  uploadPhotosToDrive(photos,nombre){
 
      var data = new FormData();
      const url = "https://termoslp.herokuapp.com/drivePost/";
      
      var name = nombre; //obtener este valor de un input, seria el nombre del termo que sube
      data.append('termo',name);
      photos.forEach((photo,index) => {
          data.append('photos', {
            uri: photo.uri,
            type: 'image/jpeg',  
            name: name+"-"+index+'.jpg',
          });
          
          console.log("Entro al foreach ",photo.uri)
      });
      fetch(url,{
        method:'post',
        body:data, 
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }).then(function(response) {
          console.log('done', response);
          return response;
        })
        .catch(function(err){ 
          console.log(err);
        });
  }



  renderImage(item, i) {
    const { width } = Dimensions.get('window');
    return(
      <Image 
        style={{height: width/2, width: width/2}}
        source={{uri: item.file}}
        key={i}
      />
    )
  }

  formCallback = (callbackData) => {
          console.log("--------Callback ",callbackData);
            this.uploadPhotosToDrive(this.state.photos,callbackData.nombre);
            var formBody = [];
            for (var property in callbackData) {
                if(property != 'requiredNombre' && property != 'nombreRepetido' ){
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(callbackData[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
              }
            }
            formBody = formBody.join("&");
            this.setState({selectedPhotos:false});//Vuelvo a actualizar selectedPhotos
            this.setState({message:"Pedido enviado"});//Vuelvo a actualizar selectedPhotos
            fetch('https://termoslp.herokuapp.com/pedidoEnviado', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: formBody
            }).then(function(response) {
                console.log('done', response);
                return response;
              })
              .catch(function(err){ 
                console.log(err);
              });   
  }

  render() {
    if (this.state.imageBrowserOpen) {
      return(
          <View style={{flex:1}}>
            <Header

            backgroundColor='black'
              rightComponent={<Button color='orange' title='Logout' onPress={() => this.dismiss() }/>}
            />
            <ImageBrowser max={10} callback={this.imageBrowserCallback}/>
          </View>
        );
    }
    return (
     <View style={{flex:1}}>
        <Header
              backgroundColor='black'
              rightComponent={<Button color='orange'  title='Logout' onPress={() => this.dismiss() }/>}
        />
      <ScrollView >

         <View style={{flexDirection: 'column',alignItems: 'center'}}>

        <Text style={{marginTop: 20,marginBottom:15,height:40,fontSize: 20,fontWeight: 'bold'}}>
          Formulario de Pedidos
        </Text>

        <Button color='orange' style={{marginTop: 15,marginBottom:20,fontSize: 20,fontWeight: 'bold'}}
          title="Seleccionar Imagenes"
          onPress={() => this.setState({imageBrowserOpen: true})}
        />
        </View>
        {(this.state.selectedPhotos && this.state.photos.length >0) ? 
          (
          <View>
            <ScrollView horizontal={true} contentContainerStyle={styles.contentContainer} >
              {this.state.photos.map((item,i) => this.renderImage(item,i))}
            </ScrollView>
            
            <FormTermo callback={this.formCallback}/>
          </View>
        )
          : <View style={{flexDirection: 'column',alignItems: 'center', marginBottom: 5}}>
              <Text style={{fontSize: 20,fontWeight: 'bold'}}> 
                {this.state.message} 
              </Text>
            </View>
        }

     </ScrollView>
     </View>
    );
  }
}


const Home2Screen = () => (

  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    
    <Text>Home Screen</Text>
  
  </View>
);

const ProfileScreen = ({navigation}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

    <Text>Profile Screen</Text>
    <Button
      onPress={() => fetch('https://termoslp.herokuapp.com/logout') }  //Ver BackHandler --- Por ahora el log out solo borra el valor en /user
      title="Log out"
    /> 

  </View>
);
/*
const MainScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <StatusBar hidden={true} />
    <App/>
  </View>

  );
*/
const RootTabs = TabNavigator({
  /*RootDrawer:{
    screen:RootDrawer,
  },*/
  Home: {
    screen: Home2Screen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },/*
  New: {
    screen: AppNavigator,
  },/*
  Details: {
    screen: screens.DetailsScreen,
  },*/

});


//Add screens to StackNavigator (each key represents a screen)
const RootNavigator = StackNavigator(
{ 
  Home2: {
    screen: HomeScreen,
  },/*
  Details: {
    screen: DetailsScreen,
        navigationOptions: {
      headerTitle: 'Details',
    },
  },*/
   Profile: {
    screen: RootTabs,
  },/*
  AppScreen:{
    screen: App,
  },*/
},{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
}
);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:Constants.statusBarHeight,
    paddingBottom:20,
  },
   contentContainer: {
    marginTop: 30,
    marginBottom:15,
  },
});



export default RootNavigator; 
//Export default hace que la clase sea publica




/*uploadPhotosToDrive(photos){
 
      var data = new FormData();
      const url = "https://frozen-everglades-78768.herokuapp.com/drivePost/";
        
      //data.append('name','testName');
      photos.forEach((photo) => {

          var blob = this.dataURItoBlob(photo.uri);
          data.append('photos', blob);
          //console.log("Entro al foreach ",photo.uri)
      });
      fetch(url,{
        method:post,
        body:data
      }).then(function(response) {
          console.log('done');
          return response;
        })
        .catch(function(err){ 
          console.log(err);
        });
  }
*/

/*
     dataURItoBlob(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
              byteString = atob(dataURI.split(',')[1]);
          else
              byteString = unescape(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type:mimeString});
    }
  */
