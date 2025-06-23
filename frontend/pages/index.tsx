import Head from 'next/head';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { FaOilCan, FaTools, FaCogs, FaCarSide, FaWrench, FaTruck } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hakim Car Service - Your Trusted Auto Service Partner</title>
        <meta name="description" content="Professional car service and maintenance at your doorstep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1>Professional Car Service at Your Doorstep</h1>
              <p>Experience hassle-free car maintenance with our expert technicians</p>
              <div className={styles.heroButtons}>
                <Link href="/onboarding" passHref>
                  <button className="btn btn-primary">Get Started</button>
                </Link>
                <button className={`${styles.btnSecondary} btn`}>Learn More</button>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={`${styles.services} section`}>
          <div className="container">
            <h2>Our Services</h2>
            <div className={styles.serviceGrid}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaOilCan />
                </div>
                <h3>Oil Change</h3>
                <p>Professional oil change service to keep your engine running smoothly and efficiently</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaTools />
                </div>
                <h3>Brakes Check</h3>
                <p>Comprehensive brake system inspection and maintenance for your safety</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaCogs />
                </div>
                <h3>Spare Parts</h3>
                <p>High-quality genuine spare parts for all car makes and models</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaCarSide />
                </div>
                <h3>Quick Service</h3>
                <p>Fast and efficient service for minor repairs and maintenance</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaWrench />
                </div>
                <h3>Hakim Maintenance</h3>
                <p>Complete car maintenance package with expert technicians</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <FaTruck />
                </div>
                <h3>Tow Truck Service</h3>
                <p>24/7 reliable towing service for emergency roadside assistance</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.cta} section`}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2>Ready to Experience Hassle-Free Car Service?</h2>
              <p>Book your service now and get 20% off on your first visit</p>
              <button className="btn btn-primary">Book Now</button>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>Hakim Car Service</h3>
              <p>Your trusted partner in car maintenance and repair</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact Us</h4>
              <p>Email: info@hakimcarservice.com</p>
              <p>Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Hakim Car Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 