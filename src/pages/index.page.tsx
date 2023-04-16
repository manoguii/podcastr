import { api } from '@/services/api'
import { IEpisode } from '@/types/episodes'
import { convertDurationToTimeString } from '@/utils/convert-duration-to-time-string'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticProps } from 'next'

export { default } from './home'

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  const data = response.data as IEpisode[]

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      url: episode.file.url,
      members: episode.members,
      thumbnail: episode.thumbnail,
      description: episode.description,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration),
      ),
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 24, // 24hrs
  }
}
