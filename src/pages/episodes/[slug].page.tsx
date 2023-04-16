import { api } from '@/services/api'
import { IEpisode } from '@/types/episodes'
import { convertDurationToTimeString } from '@/utils/convert-duration-to-time-string'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'
import Image from 'next/image'

type Episode = {
  id: string
  title: string
  url: string
  members: string
  thumbnail: string
  description: string
  duration: number
  durationAsString: string
  publishedAt: string
}

interface EpisodesProps {
  episode: Episode
}

export default function Episodes({ episode }: EpisodesProps) {
  const router = useRouter()

  async function handleGoBack() {
    await router.push('/')
  }

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <button type="button" onClick={handleGoBack}>
          <Image src="/arrow-left.svg" alt="Voltar" width={25} height={25} />
        </button>

        <Image
          src={episode.thumbnail}
          alt=""
          width={656}
          height={160}
          quality={100}
        />

        <button type="button">
          <Image src="/play.svg" alt="Tocar episodio" width={25} height={25} />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>

        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug

  const response = await api.get(`/episodes/${slug}`)

  const data = response.data as IEpisode

  const episode = {
    id: data.id,
    title: data.title,
    url: data.file.url,
    members: data.members,
    thumbnail: data.thumbnail,
    description: data.description,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24hrs
  }
}
