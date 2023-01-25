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

const PostDetails = styled.View`
  justify-content: center;
  flex: 1;
`


interface PostProps {
  title: string
  imageUrl: string
}

export function Post({ title, imageUrl }: PostProps) {

  const truncateTitle = (str: string) => {
    if (str.length >= 50) {
      return str.substring(0, 50) + '...'
    }
    return str
  }

  return (
    <PostView>
      <PostImage
        source={{ uri: imageUrl }}/>
      <PostDetails>
        <PostTitle>{truncateTitle(title)}</PostTitle>
      </PostDetails>
    </PostView>
  )
}
