import 'rc-slider/assets/index.css'
import Image from 'next/image'
import styles from './styles.module.scss'
import { useContext, useEffect, useRef } from 'react'
import { PlayerContext } from '@/contexts/PlayerContext'
import Slider from 'rc-slider'

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const {
    currentEpisodeList,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext)

  const episode = episodeList[currentEpisodeList]

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

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src="/playing.svg" alt="Tocando agora" width={32} height={32} />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image src={episode.thumbnail} width={246} height={246} alt="" />

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
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <Image
              src="/shuffle.svg"
              alt="Embaralhar"
              width={24}
              height={24}
              quality={100}
            />
          </button>
          <button type="button" disabled={!episode}>
            <Image
              src="/play-previous.svg"
              alt="Tocar anterior"
              width={24}
              height={24}
              quality={100}
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

          <button type="button" disabled={!episode}>
            <Image
              src="/play-next.svg"
              alt="Tocar próxima"
              width={24}
              height={24}
              quality={100}
            />
          </button>
          <button type="button" disabled={!episode}>
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
