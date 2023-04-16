import Image from 'next/image'
import styles from './styles.module.scss'
import ptBR from 'date-fns/locale/pt-BR'
import { format } from 'date-fns'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <Image
        src="/logo.svg"
        alt="Podcastr"
        width={163}
        height={40}
        quality={100}
      />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}
