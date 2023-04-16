import Image from 'next/image'
import styles from './styles.module.scss'
import Link from 'next/link'

type Episode = {
  id: string
  title: string
  url: string
  members: string
  thumbnail: string
  duration: number
  durationAsString: string
  publishedAt: string
}

interface HomeProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={192}
                  height={192}
                  quality={100}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <Image
                    src="/play-green.svg"
                    alt="Tocar episodio"
                    width={25}
                    height={25}
                    quality={100}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcasts</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      width={120}
                      height={120}
                    />
                  </td>
                  <td>
                    <Link href={`episodes/${episode.id}`} title={episode.title}>
                      {episode.title}
                    </Link>
                  </td>
                  <td title={episode.members}>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <Image
                        src="/play-green.svg"
                        alt="Tocar episodio"
                        width={25}
                        height={25}
                      />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
