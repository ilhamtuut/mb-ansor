import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  Alert,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Platform,
  BackHandler,
  ToastAndroid
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  List,
  ListItem,
  InputGroup,
  Input,
  Icon,
  Card,
  CardItem,
  Body,
  Grid,
  Col,
  Row,
  Spinner
} from "native-base";
import Style from "./style.js";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";
import MyFooter from "../CommonComponents/Footer";
import Banner from "../CommonComponents/Banner/index.js";
import ListDropdown from "../CommonComponents/ListDropdown/index.js";
import RoundImageButton from "../CommonComponents/RoundImageButton/index.js";
import BannerSlider from "../CommonComponents/BannerSlider/index.js";
import ThemeHeader from "../CommonComponents/Header/index.js";
import commonColor from "../../theme/variables/commonColor.js";
import NotifyContent from "../CommonComponents/NotifyContent";
import { itemsFetchData, fetchData } from "../../actions";
import { StackActions, NavigationActions } from 'react-navigation';
const bg = require("../../../assets/bg-transparent.png");
const goLogin = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
});
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

let backHandlerClickCount = 0;
const exitAlert = () => {
  Alert.alert(
    '',
    'Apakah Anda ingin keluar dari aplikasi?',
    [
      {text: 'Tidak', style: 'cancel'},
      {text: 'Ya', onPress: () => BackHandler.exitApp()}
    ],
    {cancelable: false},
  );
};

const showToastWithGravity = (click) => {
    ToastAndroid.showWithGravityAndOffset(
      "Klik 2 Kali Untuk Keluar",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: "",
      refresh_token: "",
      showSwiper: false,
      authLogin: false,
      totalNews: 0
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount(){
    this.props.fetchData();
    this.getCountData();
    this.getSession();
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    setTimeout(() => {
      this.setState({showSwiper: true});
    }, 100);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    let index = this.props.navigation.dangerouslyGetParent().state.index;
    if (index == 0) {
      const {
        clickedPosition
      } = this.state;
      backHandlerClickCount += 1;
      if ((clickedPosition !== 1)) {
        if ((backHandlerClickCount < 2)) {
          showToastWithGravity(backHandlerClickCount);
        } else {
          exitAlert();
        }
      }
    }else{
      this.props.navigation.goBack(null);
    }
    // timeout for fade and exit
    setTimeout(() => {
      backHandlerClickCount = 0;
    }, 2000);
    return true;
  }

  getCountData(){
    fetch('https://ansorjepara.or.id/wp-json/wp/v2/categories/3', {
        method: 'GET',
        headers: {
          'Accept' : 'application/json'
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({totalNews: responseJson.count});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getSession(){
    AsyncStorage.getItem('session_user', (err, result) => {
      if(result != null && result != ""){
        var data = JSON.parse(result);
        global.access_token = data.access_token;
        this.setState({ 
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          authLogin: true 
        });
      }else{
        this.props.fetchData();
      }
    });
  }

  logout(){
    this.props.navigation.dispatch(goLogin);
    AsyncStorage.clear();
  }

  Capitalize(str){
    if(str){
      var pieces = str.split(" ");
      for ( var i = 0; i < pieces.length; i++ ){
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
      }
      return pieces.join(" ");
    }
  }

  getParsedDate(strDate){
    var strSplitDate = String(strDate).split(' ');
    var date = new Date(strSplitDate[0]);
    // alert(date);
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    var m = '';
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    // if (mm < 10) {
    //     mm = '0' + mm;
    // }

    if(mm == 1){
      m = 'Januari';
    }else if(mm == 2){
      m = 'Februari';
    }else if(mm == 3){
      m = 'Maret';
    }else if(mm == 4){
      m = 'April';
    }else if(mm == 5){
      m = 'Mei';
    }else if(mm == 6){
      m = 'Juni';
    }else if(mm == 7){
      m = 'Juli';
    }else if(mm == 8){
      m = 'Agustus';
    }else if(mm == 9){
      m = 'September';
    }else if(mm == 10){
      m = 'Oktober';
    }else if(mm == 11){
      m = 'November';
    }else if(mm == 12){
      m = 'Desember';
    }

    date =  dd + " " + m + " " + yyyy;
    return date.toString();
  }

  infoRegister = () => {
    Alert.alert(
      'Informasi',
      'Siapkan Foto Diri (Pass foto berseragam) dan Foto KTP',
      [
        {text: 'Tidak', style: 'cancel'},
        {text: 'Ya', onPress: () => this.props.navigation.navigate("Register")}
      ],
      {cancelable: false},
    );
  };

  render() {
    const navigation = this.props.navigation;
    if (this.props.isLoading) {
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
            {/*<ThemeHeader PageTitle="GP ANSOR" />*/}
            <Content
              contentContainerStyle={{ paddingBottom: 10 }}
              style={{ backgroundColor: "transparent", marginBottom: null }}
              showsVerticalScrollIndicator={false}
            >
              <Card style={{ height: 80, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, backgroundColor: "#00a357", marginBottom: 10, marginTop: 0, marginLeft: 0, marginRight: 0, padding:20 }}>
                <View style={{ flex:1, flexDirection: 'row', justifyContent:'space-between' }}>
                  <View>
                      <Image style={{ height: 40, width: 40, resizeMode: "cover", alignItems: "center", justifyContent: "center" }} source={require("../../../assets/gp_ansor.png")} />
                  </View>
                  <View>
                      <Text style={{ color: '#fff', textAlign: 'center' }}>PC GP ANSOR</Text>
                      <Text style={{ color: '#fff', textAlign: 'center' }}>Kabupaten Jepara</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate((this.state.authLogin) ? "Profile" : "Login")}
                      >
                      <Image style={{ height: 40, width: 40, resizeMode: "cover", alignItems: "center", justifyContent: "center" }} source={require("../../../assets/bl_man.png")} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Swiper
                containerStyle={Style.wrapperBanner}
                showsButtons={false}
                showsPagination={false}
                autoplay={true}
                autoplayTimeout={5}
                autoplayDirection={true}
              >
              {
                this.props.items.map((item, index) => (
                  <Banner
                    onPress={() => navigation.navigate("DetailNews", {
                      titlePage: 'BERITA TERKINI',
                      title: item.title.rendered,
                      image: item._embedded['wp:featuredmedia']['0'].source_url,
                      description: item.content.rendered.replace(/(<([^>]+)>)/ig, ''),
                      url: item._links.self['0'].href,
                      time: this.getParsedDate(item.date),
                      author: this.Capitalize(item._embedded.author['0'].name),
                      link:item.link
                    })}
                    key={index}
                    bannerImageSource={item._embedded['wp:featuredmedia']['0'].source_url}
                    bannerImageText={item.title.rendered}
                  />
                ))
              }
              </Swiper>
              
              <View style={{ paddingTop: 5, paddingLeft: 20, paddingRight: 20, }}>
                <Grid>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"AmaliyahList"}
                        titlePage={"Amaliyah"}
                        navigation={navigation}
                        roundImageText={"Amaliyah"}
                        roundImageSource={require("../../../assets/icon/health.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Khutbah"}
                        titlePage={"Khutbah"}
                        navigation={navigation}
                        roundImageText={"Khutbah"}
                        roundImageSource={require("../../../assets/icon/pulsa.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Jadwal"}
                        titlePage={"Jadwal Sholat"}
                        navigation={navigation}
                        roundImageText={"Jadwal Sholat"}
                        roundImageSource={require("../../../assets/icon/paket_data.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Quote"}
                        titlePage={"Quote"}
                        navigation={navigation}
                        roundImageText={"Quote"}
                        roundImageSource={require("../../../assets/icon/kiblat.png")}
                      />
                  </Col>
                </Grid>
                <Grid>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Ngaji"}
                        titlePage={"Ngaji"}
                        navigation={navigation}
                        roundImageText={"Ngaji"}
                        roundImageSource={require("../../../assets/icon/asuransi.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={(this.state.authLogin) ? "Organisasi" : "Login"}
                        titlePage={"Organisasi"}
                        navigation={navigation}
                        roundImageText={"Organisasi"}
                        roundImageSource={require("../../../assets/icon/refresh.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Tokoh"}
                        titlePage={"Kyaiku"}
                        navigation={navigation}
                        roundImageText={"Kyaiku"}
                        roundImageSource={require("../../../assets/icon/profile.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Retail"}
                        navigation={navigation}
                        roundImageText={"Ansor Retail"}
                        roundImageSource={require("../../../assets/icon/sale.png")}
                      />
                  </Col>
                </Grid>
                <Grid>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"AddKonsultasi"}
                        titlePage={"Konsultasi"}
                        navigation={navigation}
                        roundImageText={"Konsultasi"}
                        roundImageSource={require("../../../assets/icon/transfer.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Agenda"}
                        titlePage={"Agenda"}
                        navigation={navigation}
                        roundImageText={"Agenda"}
                        roundImageSource={require("../../../assets/icon/topup.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={"Category"}
                        titlePage={"Koleksi"}
                        navigation={navigation}
                        roundImageText={"Koleksi"}
                        roundImageSource={require("../../../assets/icon/qr.png")}
                      />
                  </Col>
                  <Col style={{ justifyContent: "center", alignItems: 'center'}}>
                      <RoundImageButton
                        nav={(this.state.authLogin) ? "Settings" : "Login"}
                        titlePage={"Pengaturan"}
                        navigation={navigation}
                        roundImageText={"Pengaturan"}
                        roundImageSource={require("../../../assets/icon/setting.png")}
                      />
                  </Col>
                </Grid>
              </View>

              {(!this.state.authLogin) &&
                <View style={{ padding: 10 }}>
                  <Button
                    primary
                    block
                    rounded
                    onPress={() => this.infoRegister() }
                  >
                    <Icon type="SimpleLineIcons" active name="note" style={{ marginRight: 10, fontSize: 14}} />
                    <Text style={{ color: '#fff' }}> Registrasi </Text>
                  </Button>
                  <Button
                    style={{ marginTop: 10 }}
                    primary
                    block
                    rounded
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Icon type="SimpleLineIcons" active name="login" style={{ marginRight: 10, fontSize: 14}} />
                    <Text style={{ color: '#fff' }}> Sign In </Text>
                  </Button>
                </View>
              }

              {(this.state.authLogin) &&
                <View style={{ padding: 10 }}>
                  <Button
                    primary
                    block
                    rounded
                    onPress={() => this.logout() }
                  >
                    <Icon type="SimpleLineIcons" active name="note" style={{ marginRight: 10, fontSize: 14}} />
                    <Text style={{ color: '#fff' }}> Sign Out </Text>
                  </Button>
                </View>
              }

              <Card style={{ padding: 10, marginLeft: 0, marginRight: 0, marginBottom: 20 }}>
              <View style={{ flex:1, flexDirection: 'row', justifyContent:'space-between', marginBottom: 5 }}>
                <View>
                  <Text style={Style.bannerHeading}>Berita Terkini</Text>
                </View>
                <View>
                  <TouchableOpacity
                      onPress={() => navigation.navigate("ListNews", {
                        titlePage: "BERITA TERIKINI",
                        count: this.state.totalNews,
                        url: 'https://ansorjepara.or.id/wp-json/wp/v2/posts?categories=3&_embed'
                      })}
                    >
                    <Text style={Style.bannerHeading}>Lihat Semua</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Swiper
                containerStyle={Style.wrapper}
                showsButtons={false}
                showsPagination={false}
                autoplay={true}
                autoplayTimeout={7}
                autoplayDirection={true}
              >
              {
                this.props.news.map((item, index) => (
                  <BannerSlider
                    onPress={() => navigation.navigate("DetailNews", {
                      titlePage: 'BERITA TERKINI',
                      title: item.title.rendered,
                      image: item._embedded['wp:featuredmedia']['0'].source_url,
                      description: item.content.rendered.replace(/(<([^>]+)>)/ig, ''),
                      url: item._links.self['0'].href,
                      time: this.getParsedDate(item.date),
                      author: item._embedded.author['0'].name,
                      link:item.link
                    })}
                    key={index}
                    bannerImageSource={item._embedded['wp:featuredmedia']['0'].source_url}
                    bannerImageText={item.title.rendered}
                    bannerDescription={item.excerpt.rendered.replace(/(<([^>]+)>)/ig, '')}
                    bannerSmallText={"Lihat Selengkapnya"}
                  />
                ))
              }
              </Swiper>
              </Card>
            </Content>
          </ImageBackground>
          {/*<MyFooter navigation={navigation} selected={"home"} />*/}
        </Container>
      );
    }
  }
}

function bindAction(dispatch) {
  return {
    fetchData: token => dispatch(fetchData(token)),
    getData: url => dispatch(itemsFetchData(url))
  };
}

const mapStateToProps = state => ({
  items: state.homeReducer.items,
  news: state.homeReducer.news,
  hasErrored: state.homeReducer.hasErrored,
  isLoading: state.homeReducer.isLoading,
});
export default connect(mapStateToProps, bindAction)(HomePage);
