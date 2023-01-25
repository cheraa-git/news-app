import WebView from "react-native-webview"
import { useEffect, useRef } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParams } from "../types"
import * as ScreenOrientation from 'expo-screen-orientation'


export function WebViewPage({ route, navigation }: NativeStackScreenProps<RootStackParams, 'WebView'>) {
  const webViewRef = useRef<WebView>(null)

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      webViewRef.current?.goBack()
    })
  }, [navigation])

  useEffect(() => {
    ScreenOrientation.unlockAsync()
  }, [])

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ uri: route.params.url }}
      allowsBackForwardNavigationGestures={true}
      startInLoadingState={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      javaScriptCanOpenWindowsAutomatically={true}
      javaScriptEnabled={true}
      allowFileAccess={true}
      setSupportMultipleWindows={false}
    />
  )
}
