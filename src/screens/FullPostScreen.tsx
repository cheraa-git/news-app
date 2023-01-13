import { ScrollView } from "react-native"
import styled from "styled-components/native"
import { useEffect, useState } from "react"
import { IPost, RootStackParams } from "../types"
import { Loading } from "../components/Loading"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { PostsData } from "../posts-data"

const PostImage = styled.Image`
  border-radius: 10px;
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
`

const PostText = styled.Text`
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 30px;
`
const PostTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
`


export const FullPostScreen = ({route, navigation}: NativeStackScreenProps<RootStackParams, 'FullPost'>) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IPost>()
  const {id, timestamp} = route.params

  useEffect(() => {
    setData(PostsData.find(post => post.id === id))
    navigation.setOptions({title: new Date(+timestamp).toLocaleDateString()})
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <Loading/>
  }
  return (
    <ScrollView style={{ padding: 20 }}>
      <PostTitle>
        {data?.title}
      </PostTitle>
      <PostImage
        source={{ uri: data?.imageUrl }}/>
      <PostText>
        {data?.text}
      </PostText>
    </ScrollView>
  )
}
