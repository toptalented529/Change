import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import I18n from '../../i18n';
import images from '../../assets/images';
import styles from './styles';
import { COLOR_WHITE, COLOR_ULTRAMARINE, COLOR_BLACK } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get("screen")

const BalanceDetail = ({ balance, day = 0, hour = 0, minute = 0, second = 0, name }) => {

  const [currentDay, setCurrentDay] = useState(day)
  const [currentHour, setCurrentHour] = useState(hour)
  const [currentMinute, setCurrentMinute] = useState(minute)
  const [currentSecond, setCurrentSecond] = useState(second)

  const [remainingTime, setRemainingTime] = useState(0)
  useEffect(() => {
    const handle = async () => {
      const jwt = await AsyncStorage.getItem("jwt")
      const res = await axios.get("http://95.217.197.177:80/account/me", {
        headers: {
          authorization: `bearer ${jwt}`
        }
      }
      )



      const blockchain_purchased = new Date(name === "Blockchain" ? res.data.user.last_blockchain_purchased_date : name === "Products" ? res.data.user.last_product_purchased_date : res.data.user.last_associated_purchased_date)
      const timestamp = blockchain_purchased.getTime()



      const currentUTC = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),
        new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());

      console.log("Current UTC Timestamp: ", currentUTC,timestamp);
      const daysToMilliseconds = 30 * 24 * 60 * 60 * 1000;

      setRemainingTime(daysToMilliseconds - (currentUTC - timestamp))

    }

    handle()

  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remainingTime > 1000) {
        setRemainingTime(remainingTime - 1000);
        const seconds = Math.floor(remainingTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Calculate the remaining hours, minutes, and seconds
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        setCurrentDay(days);
        setCurrentHour(remainingHours);
        setCurrentMinute(remainingMinutes);
        setCurrentSecond(remainingSeconds);
      } else {
        setCurrentDay(0)
        setCurrentHour(0)
        setCurrentMinute(0)
        setCurrentSecond(0)
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);



  return (
    <View>


      <View style={{ borderRadius: 13, alignItems: 'center', paddingHorizontal: width * 0.1 }}>
        <View style={styles.ChronometerBox} >
          <Text style={styles.chronometer}> Chronometer</Text>
          <View style={{ flexDirection: "row", paddingHorizontal: width * 0.1 }}>
            <View style={styles.chronometersubBox}>
              <View style={styles.chronometerDays}>
                <Text style={{ color: COLOR_WHITE, fontSize: 24, fontFamily: "Poppins", fontWeight: "bold" }}>{currentDay}</Text>
              </View>
              <Text style={styles.chronometerDay}>Days</Text>
            </View>
            <View style={styles.chronometersubBox}>
              <View style={styles.chronometerDays}>
                <Text style={{ color: COLOR_WHITE, fontSize: 24, fontFamily: "Poppins", fontWeight: "bold" }}>{currentHour}</Text>
              </View>
              <Text style={styles.chronometerDay}>Hours</Text>
            </View>
            <View style={styles.chronometersubBox}>
              <View style={styles.chronometerDays}>
                <Text style={{ color: COLOR_WHITE, fontSize: 24, fontFamily: "Poppins", fontWeight: "bold" }}>{currentMinute}</Text>
              </View>
              <Text style={styles.chronometerDay}>Minutes</Text>
            </View>
            <View style={styles.chronometersubBox}>
              <View style={styles.chronometerDays}>
                <Text style={{ color: COLOR_WHITE, fontSize: 24, fontFamily: "Poppins", fontWeight: "bold" }}>{currentSecond}</Text>
              </View>
              <Text style={styles.chronometerDay}>Seconds</Text>
            </View>
          </View>
        </View>
        <LinearGradient
          colors={['#000', '#000']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.balancePriceBox, { borderRadius: 13 }]}>

          <Text style={[styles.balancePriceText, { color: '#fff', paddingTop: 12 }]}>
            {balance ? `${balance}$` : `00000$`}
          </Text>
          <Text style={[{ color: '#fff', paddingBottom: 6 }]}>
            {/* Money Today */}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default BalanceDetail;
