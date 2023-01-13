import WebView from "react-native-webview"
import { ComponentProps, useEffect, useRef, useState } from "react"
import { Platform, StatusBar, TextInput, TouchableOpacity, } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styled from "styled-components/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParams } from "../types"
import * as ScreenOrientation from 'expo-screen-orientation';

interface BarIconProps {
  name: ComponentProps<typeof Ionicons>['name']
  onPress: () => void
}



const BarIcon = ({ name, onPress }: BarIconProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center', margin: 2 }}>
      <Ionicons name={name} size={24} color="gray"/>
    </TouchableOpacity>
  )
}

const InputView = styled.View`
  background-color: #fff;
  flex-direction: row;
  flex: 1;
  border-radius: 10px;
  padding: 10px;
`
const BarView = styled.View`
  margin-left: 0;
  background-color: #eee;
  padding: 5px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${(Platform.OS === 'ios') && (+Platform.Version >= 11) ? 40 : 0}px;
`

export function WebViewPage({ route, navigation }: NativeStackScreenProps<RootStackParams, 'WebView'>) {
  const webViewRef = useRef<WebView>(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchUrl, setSearchUrl] = useState(route.params.url)

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      webViewRef.current?.goBack()
    })
  }, [navigation])

  useEffect(() => {
    ScreenOrientation.unlockAsync().then((data) => console.log('UNLOCK', data))
  }, [])


  const searchHandler = () => {
    if (searchInput.indexOf('http://') === 0 || searchInput.indexOf('https://') === 0) {
      setSearchUrl(searchInput)
    } else {
      setSearchUrl(`https://www.google.com/search?q=${searchInput.replace(' ', '+')}`)
    }
  }

  const goBackPage = () => {
    webViewRef.current?.goBack()
  }
  const goForwardPage = () => {
    webViewRef.current?.goForward()
  }

  const reloadPage = () => {
    webViewRef.current?.reload()
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff"/>

      <BarView>
        <BarIcon name="arrow-back" onPress={goBackPage}/>
        <BarIcon name="arrow-forward" onPress={goForwardPage}/>
        <InputView>
          <TextInput
            style={{ flex: 1, }}
            placeholder="Введите запрос"
            value={searchInput}
            onChangeText={(e) => setSearchInput(e)}
          />
          <BarIcon name="search" onPress={searchHandler}/>
        </InputView>
        <BarIcon name="reload" onPress={reloadPage}/>
      </BarView>

      <WebView
        ref={webViewRef}
        source={{ uri: searchUrl }}
        allowsBackForwardNavigationGestures={true}
        startInLoadingState={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
        javaScriptEnabled={true}
        allowFileAccess={true}

      />
    </>
  )
}
