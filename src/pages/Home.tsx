import Hero from '../components/layout/Hero';
import Features from '../components/features/Features';
import Footer from '../components/layout/Footer';
import LandingHeader from '../components/layout/LandingHeader';

const Home = () => {
  return (
    <div>
      <LandingHeader />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;