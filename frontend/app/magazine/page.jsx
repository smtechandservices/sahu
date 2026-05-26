import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MagazineHero from '../../components/Magazine/MagazineHero';
import MagazineFeatured from '../../components/Magazine/MagazineFeatured';
import MagazineArchives from '../../components/Magazine/MagazineArchives';

export const metadata = {
  title: 'Magazine',
  description: 'Explore the Sahu Sabha magazine, celebrating our community heritage and future.',
};

export default function MagazinePage() {
  return (
    <>
      <Header />
      <main>
        <MagazineHero />
        <MagazineFeatured />
        <MagazineArchives />
      </main>
      <Footer />
    </>
  );
}
