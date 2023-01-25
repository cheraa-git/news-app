import { Navigation } from "./src/screens/Navigation"
import { StatusBar } from "react-native"

export default function App() {

  return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
        <Navigation/>
      </>
  )
}
