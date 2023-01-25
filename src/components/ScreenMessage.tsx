import { FC, ReactNode } from "react"
import { Button, Text, View } from "react-native"


interface ScreenMessageProps {
  children?: ReactNode,
  onReload: () => void
}

export const ScreenMessage: FC<ScreenMessageProps> = ({ children, onReload }) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, fontWeight: '300', marginBottom: 20}}>{children}</Text>
      <Button title="Reload" onPress={onReload}/>
    </View>
  )
}
