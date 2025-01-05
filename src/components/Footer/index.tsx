import styles from './styles.module.scss';
import Image from 'next/image';
import logoImg from '../../../public/logo.svg';
import { FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logo}>
          <Image src={logoImg} alt="Logo E2E Burguer" width={80} height={80} />
        </div>
        <div className={styles.info}>
          <div className={styles.item}>
            <FaInstagram className={styles.icon} />
            <a href="https://www.instagram.com/e2etreinamentos/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
          <div className={styles.item}>
            <FaLinkedin className={styles.icon} />
            <a href="https://br.linkedin.com/company/e2e-treinamentos" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
          <div className={styles.item}>
            <MdLocationOn className={styles.icon} />
            <span>Av. dos Parques, 45 - Alphaville, Santana de Parnaíba - SP, 06544-300</span>
          </div>
          <div className={styles.item}>
            <FaPhone className={styles.icon} />
            <span>(11) 94005-3248</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
