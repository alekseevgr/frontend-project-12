import { Link } from 'react-router-dom'
import styles from '../../styles/StartPage.module.css'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.root}>
      <div>{t('login.invalidPath')}</div>
      <Link className={styles.link} to="/">
        {t('chatName')}
      </Link>
    </div>
  )
}

export default NotFound
