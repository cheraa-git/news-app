import { View, FlatList, RefreshControl, TouchableOpacity, Button } from 'react-native'
import { useEffect, useState } from "react"
import { IPost, RootStackParams } from "../types"
import { Post } from "../components/Post"
import { Loading } from "../components/Loading"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { PostsData } from "../posts-data"


export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Home'>) {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<IPost[]>()


  const fetchPosts = () => {
    setItems(PostsData)
  }

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
    })
  }, [navigation])

  useEffect(() => {
    fetchPosts()
    setIsLoading(false)
  }, [])

  const testView = () => {
    navigation.navigate('WebView', { url: 'https://www.youtube.com' })
  }

  if (isLoading) {
    return <Loading/>
  }
  return (
    <View>
      <Button title={'web-view'} onPress={testView}/>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPosts}/>}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FullPost', { id: item.id, timestamp: item.timestamp })}>
            <Post key={item.id} title={item.title} imageUrl={item.imageUrl} timestamp={item.timestamp}/>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
