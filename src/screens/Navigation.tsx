import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeScreen } from "./HomeScreen"
import { FullPostScreen } from "./FullPostScreen"
import { NavigationContainer } from "@react-navigation/native"
import { RootStackParams } from "../types"
import { WebViewPage } from "./WebViewPage"
import { LoadingScreen } from "./LoadingScreen"


const Stack = createNativeStackNavigator<RootStackParams>()

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name={"Loading"} component={LoadingScreen}
                      options={{ header: () => null, gestureEnabled: false }}/>

        <Stack.Screen name={"Home"}
                      component={HomeScreen}
                      options={{ headerLeft: () => <></>, gestureEnabled: false, title: 'Новости спорта' }}/>

        <Stack.Screen name={"FullPost"} component={FullPostScreen} options={{ title: 'Статья' }}/>
        <Stack.Screen name={"WebView"} component={WebViewPage} options={{ header: () => null, gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}


