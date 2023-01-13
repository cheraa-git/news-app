import { Loading } from "../components/Loading"
import { useEffect, useState } from "react"
import * as Cellular from 'expo-cellular'
import * as Device from 'expo-device'
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import remoteConfig from "@react-native-firebase/remote-config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Network from 'expo-network'
import { ScreenMessage } from "../components/ScreenMessage"


export function LoadingScreen({ navigation }: NativeStackScreenProps<any, 'Loading'>) {
  const [screenMessage, setScreenMessage] = useState('')

  interface IinitialDebugInfo {
    brand?: string | null
    isDevice?: boolean
    simIsAvailable?: boolean
    remoteUrl?: string
    remoteUrlError?: string
    localUrl?: string | null
    localUrlIsSaved?: boolean
    networkIsConnected?: boolean
  }

  let debugInfo: IinitialDebugInfo = {
    brand: "",
    isDevice: undefined,
    simIsAvailable: undefined,
    remoteUrl: "",
    remoteUrlError: "",
    localUrl: "",
    localUrlIsSaved: false,
    networkIsConnected: undefined,
  }

  const validateDevice = async (): Promise<boolean> => {
    try {
      const { brand, isDevice } = Device
      const simIsAvailable = Boolean(await Cellular.getCarrierNameAsync())
      const isValidate = brand && brand !== 'google' && isDevice && simIsAvailable
      console.log('Device info:', { brand, isDevice, simIsAvailable })
      debugInfo = { ...debugInfo, brand, isDevice, simIsAvailable }
      return Boolean(isValidate)
    } catch (e) {
      console.log(e)
      return false
    }
  }


  const fetchFirebaseConfigUrl = async () => {
    try {
      await remoteConfig().fetch(60) // TODO: set value to 60
      await remoteConfig().setDefaults({
        url: '',
      })
      await remoteConfig().fetchAndActivate()
      const remoteUrl = remoteConfig().getValue('url').asString()
      console.log('remoteUrl: ', remoteUrl)
      debugInfo = { ...debugInfo, remoteUrl }
      return { url: remoteUrl, error: '' }
    } catch (err) {
      debugInfo = { ...debugInfo, remoteUrlError: `${err}` }
      return { url: '', error: `Firebase error: ${err}` }
    }
  }

  const getLocalUrl = async (): Promise<string | null> => {
    const url = await AsyncStorage.getItem('url')
    debugInfo = { ...debugInfo, localUrl: url }
    if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)) {
      console.log('localUrl(valid):', url)
      return url
    }
    console.log('localUrl(invalid):', url)
    return null
  }

  const setLocalUrl = async (url: string) => {
    debugInfo = { ...debugInfo, localUrlIsSaved: true }
    await AsyncStorage.setItem('url', url)
  }

  const checkNetworkConnection = async (): Promise<boolean> => {
    const networkState = await Network.getNetworkStateAsync()
    debugInfo = {...debugInfo, networkIsConnected: networkState.isConnected}
    console.log('isConnected:', networkState.isConnected)
    return Boolean(networkState.isConnected)
  }


  const fullValidation = async () => {
    await AsyncStorage.removeItem('url')
    const localUrl = await getLocalUrl()
    const isNetworkConnected = await checkNetworkConnection()
    // const isNetworkConnected = false

    if (localUrl) {
      debugInfo = {...debugInfo, localUrlIsSaved: false}
      // setDebugInfo(prev => ({ ...prev, localUrlIsSaved: false }))
      if (isNetworkConnected) return { screen: "WebView", url: localUrl }
      else return {
        screen: "Loading",
        message: 'Для работы приложения необходим доступ к интернету. Повторите попытку позже...'
      }

    } else {
      let remoteUrl = await fetchFirebaseConfigUrl()
      const isDeviceValid = await validateDevice()
      // const isDeviceValid = true
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
      console.log('SCREEN', data)
      switch (data.screen) {
        case 'Home':
          navigation.navigate('Home')
          break
        case 'Loading':
          setScreenMessage(data.message || 'Ошибка')
          break
        case "WebView":
          navigation.navigate('WebView', { url: data.url })
      }
      console.log('---------------------------')


      console.log(debugInfo)
      let debugInfoStr: any = { ...debugInfo }
      Object.entries(debugInfo).forEach(([key, val]) => {
        if (val === undefined) {
          debugInfoStr[key] = 'undefined'
        }
      })

      alert(JSON.stringify(debugInfoStr, null, 2))
    })

  }

  useEffect(navigateHandler, [])

  return screenMessage
    ? <ScreenMessage onReload={navigateHandler}>{screenMessage}</ScreenMessage>
    : <Loading/>
}


