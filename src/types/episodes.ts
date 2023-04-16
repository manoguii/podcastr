type File = {
  url: string
  duration: number
}

export interface IEpisode {
  id: string
  title: string
  members: string
  duration: number
  thumbnail: string
  published_at: string
  description: string
  file: File
}
