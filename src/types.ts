export interface IPost {
  id: string
  title: string
  imageUrl: string
  text: string
  category: string
  timestamp: string
}

export type RootStackParams = {
  Home: undefined,
  FullPost: { id: string, timestamp: string }
  WebView: { url: string }
  Loading: undefined
}
