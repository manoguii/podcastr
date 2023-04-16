import { ReactNode, createContext, useState } from 'react'

type Episode = {
  id: string
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  hasNext: boolean
  hasPrevious: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode: Episode) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  clearPlayerState: () => void
  setPlayingState: (state: boolean) => void
  playList: (episodes: Episode[], index: number) => void
}

interface PlayerContextProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0)
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isShuffling, setIsShuffling] = useState<boolean>(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(episodes: Episode[], index: number) {
    setEpisodeList(episodes)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length,
      )

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        play,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
