import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  InputGroup,
  Input,
  Footer,
  Text,
  FooterTab,
  Icon,
  Card,
  CardItem,
  Label,
  Form,
  Item,
  Segment,
  Spinner
} from "native-base";
import Style from "./style.js";
import Root from '../../root/Url';
import { connect } from "react-redux";
import ThemeHeader from "../CommonComponents/Header/index.js";
var deviceWidth = Dimensions.get("window").width;
const bg = require("../../../assets/bg-transparent.png");

class Abouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  }

  componentWillMount(){
    this.fetchData();
  }

  fetchData(){
    this.setState({
      loading: true
    });
    fetch(Root.link + 'about', {
        method: 'GET',
        headers: {
          'Accept' : 'application/json', 
          'Content-Type' : 'application/json'
        }
      })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false
        });
        try{
          var obj = responseJson;
          if(obj.success){
            this.setState({
              data: obj.data
            });
          }
        }catch(err){
          console.log(err.message + " Error");
        }
      }).catch(function(err) {
          console.log(err.message + " Error");
      }).done();
  }

  render() {
    const navigation = this.props.navigation;
    if (this.state.loading) {
      return (
        <Container>
          <View style={Style.spinnerBackground}>
            <Spinner style={Style.spinnerStyle}/>
          </View>
        </Container>);
    } else {
      return (
        <Container>
          <ImageBackground source={bg} style={Style.backgroundImageLogin}>
            <ThemeHeader
              PageTitle="Tentang Aplikasi"
              IconLeft="arrow-back"
              route="homepage"
              navigation={navigation}
            />
            <Content
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: "transparent", marginBottom: 30, padding: 10 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {this.state.data.map((item, index) => (
                <Text key={index} style={{ textAlign: 'justify', color: '#555', fontSize: 12 }}>{item.about}</Text>
              ))}
              <Text style={{ textAlign: 'center', color: '#555', fontSize: 12, marginTop: 20 }}>Versi Aplikasi 3.1.1</Text>
            </Content>
          </ImageBackground>
        </Container>
      );
    }
  }
}

function bindAction(dispatch) {
  return {

  };
}

const mapStateToProps = state => ({

});
export default connect(mapStateToProps, bindAction)(Abouts);
