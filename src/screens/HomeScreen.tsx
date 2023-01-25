import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { useEffect, useState } from "react"
import { IPost, RootStackParams } from "../types"
import { Post } from "../components/Post"
import { Loading } from "../components/Loading"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { PostsData } from "../posts-data"


export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Home'>) {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<IPost[]>()


  const fetchPosts = () => {
    setPosts(PostsData)
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


  if (isLoading) {
    return <Loading/>
  }
  return (
    <View>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPosts}/>}
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FullPost', { id: item.id })}>
            <Post key={item.id} title={item.title} imageUrl={item.imageUrl}/>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
