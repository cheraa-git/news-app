import styled from "styled-components/native"

const PostView = styled.View`
  flex-direction: row;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  border-bottom-style: solid;
`

const PostImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 12px;
`

const PostTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
`
const PostDate = styled.Text`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 2px;
`

const PostDetails = styled.View`
  justify-content: center;
  flex: 1;
`

const truncateTitle = (str: string) => {
  if (str.length >= 50) {
    return str.substring(0, 50) + '...'
  }
  return  str
}


interface PostProps {
  title: string
  imageUrl: string
  timestamp: string
}
export function Post({ title, imageUrl, timestamp }: PostProps) {
  return (
    <PostView>
      <PostImage
        source={{ uri: imageUrl }}/>
      <PostDetails>
        <PostTitle>{truncateTitle(title)}</PostTitle>
        <PostDate>{new Date(+timestamp).toLocaleDateString()}</PostDate>
      </PostDetails>
    </PostView>
  )
}
