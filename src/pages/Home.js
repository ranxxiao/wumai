/**
 * Created by Yiran on 2018/3/27.
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
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Icon3 from 'react-native-vector-icons/Entypo';

import Upload from './Upload';

const { width, height } = Dimensions.get('window');
console.log(height);

//获取日期对象
let myDate = new Date();
//获取年份
let year = myDate.getFullYear();
//获取月份，返回月份0~11
let month = myDate.getMonth();
let monthMap = month + 1;
//获取日期，返回1~31
let day = myDate.getDate();
//获取星期几，返回0~6
let thisWeek = myDate.getDay();
let weekMap = new Map([[1,'一'],[2,'二'],[3,'三'],[4,'四'],[5,'五'],[6,'六'],[0,'日']]);
let week = weekMap.get(thisWeek);
//生成日期
let currentDate = year + '-' + monthMap + '-' + day + '  ' + '星期' + week;

//console.log(currentDate);


export default class Home extends Component {
    static navagationOptions = {
        title: '首页',
    };

    state = {
        refreshing:true,
        pm2_5: 0,
        tempHigh: 0,
        tempLow: 0,
        type: '',
        pm2_5info: '',
        humidity: 0,
        pressure: 0,
        windSpeed: 0,
        windDirect: '',
        windPower: 0,
        pm10: 0,
        so2: 0,
    };

    componentWillMount() {
        this.getWeather();
        //this.getDouban();
    }

    render() {
        const { navigate } = this.props.navigation;
        const {
            pm2_5, pm2_5info,
            tempHigh, tempLow,
            humidity, pressure,
            windSpeed, windDirect, windPower,
            pm10, so2,
        } = this.state;
        return (
            <View>
                <ImageBackground
                    source = {require('../images/bgsky.jpg')}
                    style = {{height: height , width: width}}
                >

                    <View style = {styles.icons}>
                        <TouchableOpacity
                            onPress = {() => navigate('Upload')}
                            style = {styles.headingIcon}
                        >
                            <Icon
                                name = "camera"
                                size = {30}
                                color = "#4E84B0"
                            />
                        </TouchableOpacity>
                        <Text style = {styles.today}>{currentDate}</Text>
                        <TouchableOpacity
                            onPress = {() => {alert('分享到朋友圈')}}
                            style = {styles.headingIcon}
                        >
                            <Icon
                                name = "share"
                                size = {30}
                                color = "#4E84B0"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.location}>
                        <Icon3
                            name = "location-pin"
                            size = {20}
                            style = {{backgroundColor: 'transparent'}}
                        />
                        <Text style = {{fontSize: 16 , backgroundColor: 'transparent'}}>北京</Text>
                    </View>

                    <View style = {styles.air}>
                        <ActivityIndicator
                            size = 'large'
                            style = {{position:'absolute'}}
                            animating = {this.state.refreshing}
                        />
                        <Text style = {styles.airText}>pm2.5指数</Text>
                        <Text style = {styles.airValue}>{pm2_5}</Text>
                        <Text style = {styles.airDiscribe}>{pm2_5info}</Text>
                    </View>

                    <View style={styles.weather}>
                        <LinearGradient
                            colors={['#B9CFD6', '#3b5998', '#192f6a']}
                            style={{
                                paddingTop: 10,
                                marginHorizontal: 0.5,
                                alignItems: 'center',
                                height: 0.2*height,
                                width: 0.25*width,
                            }}
                        >
                            <Text style={styles.weatherTitle}>温度</Text>
                            <Text style={styles.weatherText}>最高温：{tempHigh}°</Text>
                            <Text style={styles.weatherText}>最低温：{tempLow}°</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#B9CFD6', '#3b5998', '#192f6a']}
                            style={{
                                paddingTop: 10,
                                marginHorizontal: 0.5,
                                alignItems: 'center',
                                height: 0.2*height,
                                width: 0.125*width,
                            }}
                        >
                            <Text style={styles.weatherTitle}>湿度</Text>
                            <Text style={styles.weatherText}>{humidity}</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#B9CFD6', '#3b5998', '#192f6a']}
                            style={{
                                paddingTop: 10,
                                marginHorizontal: 0.5,
                                alignItems: 'center',
                                height: 0.2*height,
                                width: 0.125*width,
                            }}
                        >
                            <Text style={styles.weatherTitle}>气压</Text>
                            <Text style={styles.weatherText}>{pressure}</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#B9CFD6', '#3b5998', '#192f6a']}
                            style={{
                                paddingTop: 10,
                                marginHorizontal: 0.5,
                                alignItems: 'center',
                                height: 0.2*height,
                                width: 0.25*width,
                            }}
                        >
                            <Text style={styles.weatherTitle}>风</Text>
                            <Text style={styles.weatherText}>风速：{windSpeed}</Text>
                            <Text style={styles.weatherText}>风向：{windDirect}</Text>
                            <Text style={styles.weatherText}>风力：{windPower}</Text>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#B9CFD6', '#3b5998', '#192f6a']}
                            style={{
                                paddingTop: 10,
                                marginHorizontal: 0.5,
                                alignItems: 'center',
                                height: 0.2*height,
                                width: 0.25*width,
                            }}
                        >
                            <Text style={styles.weatherTitle}>其他污染物</Text>
                            <Text style={styles.weatherText}>pm10：{pm10}</Text>
                            <Text style={styles.weatherText}>SO2：{so2}</Text>
                        </LinearGradient>
                    </View>

                </ImageBackground>
            </View>
        );
    }

    //获取天气信息
    getWeather = () => {
        this.setState({
            refreshing:true,
        });
        return fetch('http://jisutqybmf.market.alicloudapi.com/weather/query?cityid=1', {
            method: 'GET',
            headers: {
                'Authorization': 'APPCODE 1c1b3c366a2d44469c3fd9cd0b6eca2a'
            },
        })
            .then((response) => response.text())
            .then((responseText) => {
                const json = JSON.parse(responseText);
                this.setState({
                    pm2_5: json.result.aqi.pm2_5,
                    tempHigh: json.result.temphigh,
                    tempLow: json.result.templow,
                    type: json.result.weather,
                    pm2_5info: json.result.aqi.aqiinfo.affect,
                    humidity: json.result.humidity,
                    pressure: json.result.pressure,
                    windSpeed: json.result.windspeed,
                    windDirect: json.result.winddirect,
                    windPower: json.result.windpower,
                    pm10: json.result.aqi.pm10,
                    so2: json.result.aqi.so2,
                    refreshing:false,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };
}

styles = StyleSheet.create({
    icons:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:8,
        marginHorizontal:5,
        ...Platform.select({
            ios:{
                marginTop:0.04*height,
            },
        }),

    },
    headingIcon:{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    today:{
        fontSize:24,
        fontFamily:'Gill Sans',
        backgroundColor:'transparent',
    },
    air:{
        marginTop:9/32*height,
        alignItems:'center',
    },
    airText:{
        fontSize:18,
        backgroundColor:'transparent',
    },
    airValue:{
        fontSize:64,
        backgroundColor:'transparent',
    },
    airDiscribe:{
        fontSize:14,
        backgroundColor:'transparent',
        marginHorizontal:0.08*width,
    },
    location:{
        position: 'absolute',
        marginTop:0.75 * height,
        flexDirection: 'row',
        marginLeft: 10
    },
    weather:{
        position:'absolute',
        marginTop:0.8*height,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    weatherTitle:{
        marginVertical:2,
        color:'white',
        fontSize:13,
        backgroundColor:'transparent',
    },
    weatherText:{
        marginVertical:2,
        color:'white',
        fontSize:12,
        backgroundColor:'transparent',
    },
});