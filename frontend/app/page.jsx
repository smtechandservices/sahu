import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Inspirational from '../components/Home/Inspirational';
import Services from '../components/Home/Services';
import NewsEvents from '../components/Home/NewsEvents';
import Support from '../components/Home/Support';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Inspirational />
        <Services />
        <NewsEvents />
        <Support />
      </main>
      <Footer />
    </>
  );
}
