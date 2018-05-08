/**
 * Created by Yiran on 2018/3/28.
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon3 from 'react-native-vector-icons/Entypo';
import Home from './Home';

const {width, height} = Dimensions.get('window');

//图片选择器
let ImagePicker = require('react-native-image-picker');
//图片选择器参数设置
let options = {
  title: '请选择图片来源',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'相册图片',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Upload extends Component {
  static navagationOptions = {
    title:'Upload',
  };
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      avatarSource:null,
      imagePath: {},
      value: '',
    }
  }
  render(){
    const { navigate } = this.props.navigation;
    return(
        <View style={styles.content}>
          <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
              ...Platform.select({
                  ios:{
                      marginTop:0.04*height
                  },
              })}}>
            <TouchableOpacity style={{
                width:40,
                height:40,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'transparent',
            }}>
              <Icon3 name="reply" size={40} color="#4E84B0"
                     onPress={()=>navigate('Home')}
              />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.choosePic.bind(this)}
                style={{
                    width:200,
                    height:40,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'transparent',
                }}
            >
              <Text>点击打开图片</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>{alert('分享结果至朋友圈')}}
                style={{
                    width:40,
                    height:40,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'transparent',
                }}
            >
              <Icon3 name="forward" size={40} color="#4E84B0"/>
            </TouchableOpacity>
          </View>

          <View style={{
              alignItems:'center',
              width:width,
              height:524/640*height,
              backgroundColor:'white'
          }}>
            <ImageBackground source={this.state.avatarSource} style={{width:width,height:524/640*height}}>
              <Text style={{
                  position:'absolute',
                  top:480/640*height,
                  left:10,
                  color:'rgba(255,255,255,0.6)',
                  fontSize:20,
                  fontFamily:'Gill Sans',
                  backgroundColor:'transparent',
              }}>
                  MCPRL</Text>
            </ImageBackground>
          </View>

          <View
              style={{
                  position:'absolute',
                  ...Platform.select({
                      ios:{
                          marginTop:524/640*height+40+0.04*height,
                          height:height-(524/640*height+40+0.04*height)
                      },
                      android:{
                          marginTop:524/640*height+30,
                          height:height-(524/640*height+40)-10,
                      }}),
                  width:width,
                  backgroundColor:'lightblue',
                  flexDirection:'row',
                  justifyContent:'space-between',
                  alignItems:'center'
              }}
          >
            <View style={{flexDirection:'row', justifyContent:'flex-start', marginLeft:140}}>
              <Text style={styles.pmText}>PM2.5：</Text>
              <Text style={styles.pmText}>{this.state.value}</Text>
            </View>
          </View>
        </View>
    );
  }

  //选择照片按钮点击
 choosePic() {
    ImagePicker.showImagePicker(options, (response) => {
      this.setState({
        value: '',
      })
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('用户取消了选择！');
      }
      else if (response.error) {
        alert("ImagePicker发生错误：" + response.error);
      }
      else if (response.customButton) {
        alert("自定义按钮点击：" + response.customButton);
      }
      else {
        let source = { uri:  response.uri };
        //let time = { timestamp:  response.timestamp };
        //let longitude = { longitude:  response.longitude };
        //let longtitude = { longtitude: response.longtitude}
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        let imagePath = { path : "file://" + response.path}
        this.setState({
          //longitudeValue: longitude,
          avatarSource: source,
          //timeStamp: time,
          imagePath:imagePath,
        });

        //console.log(this.state.timeStamp);
        //console.log(typeof(this.state.timeStamp.toString()));
        //console.log(this.state.imagePath);

        let url = 'http://10.112.253.25:5003/upload'; //接口地址
        let file = { uri:this.state.imagePath.path, type:'multipart/form-data', name:'image.png' } ; //file中这三个元素缺一不可

        let formData = new FormData();
        formData.append('img', file); //这里的file要与后台名字对应
        //formData.append('time', this.state.timeStamp.timestamp);
        //formData.append('longtitude', longtitudeValue);

        fetch(url,{
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }).then(
            //console.log(image.path)

        )
            .then((response) => {
              console.log("response", JSON.parse(response._bodyInit).pm25);
              let num =  JSON.parse(response._bodyInit).pm25;
              this.setState({
                value: num,
              })
            })
            .catch(err=> {
              console.log("err:",err)
            })

      }
    });
  }
};


styles = StyleSheet.create({
    topBar:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:0.04*height
    },
    content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between',
    },
    icons:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
  pmText:{
    fontSize:30,
    fontFamily:'Gill Sans',
  },
})