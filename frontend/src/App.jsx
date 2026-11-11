import Nav from './site/Nav';
import Hero from './site/Hero';
import Ticker from './site/Ticker';
import About from './site/About';
import Venues from './site/Venues';
import Sound from './site/Sound';
import Radio from './site/Radio';
import Sets from './site/Sets';
import Gallery from './site/Gallery';
import Booking from './site/Booking';
import Footer from './site/Footer';
import PlayerBar from './site/PlayerBar';
import BookSheet from './site/BookSheet';
import { RadioProvider } from './site/radio';

export default function App() {
  return (
    <RadioProvider>
      <div className="grain">
        <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <About />
          <Venues />
          <Sound />
          <Radio />
          <Sets />
          <Gallery />
          <Booking />
        </main>
        <Footer />
        <PlayerBar />
        <BookSheet />
      </div>
    </RadioProvider>
  );
}
