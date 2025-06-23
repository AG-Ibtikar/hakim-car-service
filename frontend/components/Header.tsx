import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <h1>Hakim</h1>
          </Link>
          
          <div className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
            <Link href="#services">Services</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
            <button 
              className={styles.signinButton}
              onClick={() => router.push('/auth/login/customer')}
            >
              Sign In
            </button>
            <button 
              className={styles.signupButton}
              onClick={() => router.push('/auth/register/customer')}
            >
              Sign Up
            </button>
          </div>

          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>
  );
} 