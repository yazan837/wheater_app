import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import {styles} from './styles';

const MainScreen = () => {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState('');
  const [city, setCity] = useState('Dubai');
  const [icon, setIcon] = useState('');
  const [city_display, setCityDisplay] = useState('');
  const [desc, setDesc] = useState('');
  const [main, setMain] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [visibility, setVisibility] = useState('');
  const [latitude, setlatitude] = useState(38.7259284);
  const [longitude, setlongitude] = useState(-9.137382);

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      setlatitude(location.latitude);
      setlongitude(location.longitude);
    })
    .catch(error => {
      const {code, message} = error;
      console.warn(code, message);
    });
  useEffect(() => {
    fetch_weather();
    fetch_weather_next_ten_days();
  }, []);

  const fetch_weather = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&,uk&APPID=399f4623d144fac0440b9ea2d9af4fa0`,
    )
      .then(response => response.json())
      .then(json => {
        setTemp((json.main.temp - 273.15).toFixed(2) + ' °C');
        setCity(json.name);
        setIcon(json.weather[0].icon);
        setDesc(json.weather[0].description);
        setMain(json.weather[0].main);
        setHumidity(json.main.humidity + ' %');
        setPressure(json.main.pressure + ' hPa');
        setVisibility((json.visibility / 1000).toFixed(2) + ' Km');
      })
      .catch(error => console.error(error));
  };
  const fetch_weather_next_ten_days = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}4&lon=${longitude}&cnt=7&appid=399f4623d144fac0440b9ea2d9af4fa0`,
    )
      .then(response => response.json())
      .then(json => {
        setData(json);
      })
      .catch(error => console.error(error));
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="#000" />
      <ImageBackground
        source={{
          uri: 'https://cdn.dribbble.com/users/648922/screenshots/11206395/media/5998f56329eda70b71fecd050032bc21.png',
        }}
        style={styles.Image_Background_Style}>
        <View style={styles.Search_Box_View}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#FFF"
            style={styles.Search_Box}
            onChangeText={text => setCityDisplay(text)}
          />
          <TouchableOpacity
            style={styles.button_touch}
            onPress={fetch_weather}></TouchableOpacity>
        </View>

        <View style={styles.Weather_Box_Main}>
          <View style={styles.Weather_Holder_View}>
            <Image
              source={{
                uri: 'http://openweathermap.org/img/wn/' + icon + '@2x.png',
              }}
              style={styles.Weather_Image}
            />
            <View>
              <Text style={styles.temprature_text}>{temp}</Text>
              <Text style={styles.city_text}>{city}</Text>
            </View>
          </View>
        </View>

        <View style={styles.Info_Box_View}>
          <View style={styles.Info_Holder_View}>
            <Text style={styles.Main_Weather_Text}>{main}</Text>
            <Text style={styles.description_text}>{desc}</Text>
            <Text style={styles.humidity_text}>Humidity : {humidity}</Text>
            <Text style={styles.other_text}>Pressure : {pressure}</Text>
            <Text style={styles.other_text}>Visibility : {visibility}</Text>
          </View>
        </View>
        <FlatList
          data={data}
          horizontal
          renderItem={(el: any) => {
            return (
              <View style={styles.Info_Box_View}>
                <View style={styles.Info_Holder_View}>
                  <Text style={styles.Main_Weather_Text}>{el.main.temp}</Text>
                  <Text style={styles.description_text}>
                    {el.weather[0].description}
                  </Text>
                  <Text style={styles.humidity_text}>
                    Humidity : {el.main.humidity + ' %'}
                  </Text>
                  <Text style={styles.other_text}>
                    Pressure : {el.main.pressure + ' hPa'}
                  </Text>
                  <Text style={styles.other_text}>
                    Visibility : {el.visibility}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default MainScreen;
