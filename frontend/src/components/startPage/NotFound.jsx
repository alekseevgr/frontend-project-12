import { Link } from 'react-router-dom'
import styles from '../../styles/StartPage.module.css'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.center}>
      <div className={styles.notFound}>
        <div>{t('login.invalidPath')}</div>
        <Link className={styles.footerLink} to="/">
          {t('chatName')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
