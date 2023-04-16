import 'rc-slider/assets/index.css'
import Image from 'next/image'
import styles from './styles.module.scss'
import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'
import { usePlayer } from '@/hooks/usePlayer'
import { convertDurationToTimeString } from '@/utils/convert-duration-to-time-string'

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    if (!audioRef.current) {
      return
    }

    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      if (!audioRef.current) {
        return
      }

      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number | number[]) {
    if (!audioRef.current) {
      return
    }

    if (Array.isArray(amount)) {
      amount = Number(amount)
    }

    audioRef.current.currentTime = amount

    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const totalPodcastTime = convertDurationToTimeString(episode?.duration ?? 0)

  const howMuchTimeHasPassedOfPodcast = convertDurationToTimeString(progress)

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src="/playing.svg" alt="Tocando agora" width={32} height={32} />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image src={episode.thumbnail} width={200} height={200} alt="" />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{howMuchTimeHasPassedOfPodcast}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{totalPodcastTime}</span>
        </div>

        {episode && (
          <audio
            autoPlay
            ref={audioRef}
            loop={isLooping}
            src={episode.url}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
          >
            <Image
              src="/shuffle.svg"
              alt="Embaralhar"
              width={24}
              height={24}
              quality={100}
            />
          </button>
          <button type="button" disabled={!episode || !hasPrevious}>
            <Image
              src="/play-previous.svg"
              alt="Tocar anterior"
              width={24}
              height={24}
              quality={100}
              onClick={playPrevious}
            />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Image
                src="/pause.svg"
                alt="Pausar"
                width={28}
                height={28}
                quality={100}
              />
            ) : (
              <Image
                src="/play.svg"
                alt="Tocar"
                width={64}
                height={64}
                quality={100}
              />
            )}
          </button>

          <button type="button" disabled={!episode || !hasNext}>
            <Image
              src="/play-next.svg"
              alt="Tocar próxima"
              width={24}
              height={24}
              quality={100}
              onClick={playNext}
            />
          </button>
          <button
            type="button"
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
            onClick={toggleLoop}
          >
            <Image
              src="/repeat.svg"
              alt="Repetir"
              width={24}
              height={24}
              quality={100}
            />
          </button>
        </div>
      </footer>
    </div>
  )
}
