import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScrollStory } from './components/ScrollStory';
import { FlowerSwitch } from './components/FlowerSwitch';
import { Collection } from './components/Collection';
import { Configurator } from './components/Configurator';
import { About, Contact, Footer, LegalDialog, Marquee } from './components/Sections';
import { ProductDialog } from './components/ProductDialog';
import { CartDrawer } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Cursor, Toast, useAmbientMotion } from './components/Effects';
import { initSmoothScroll } from './lib/scroll';

export default function App() {
  useEffect(() => initSmoothScroll(), []);
  useAmbientMotion();
  useEffect(() => {
    document.documentElement.classList.add('is-loaded');
    const id = location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
        <FlowerSwitch />
        <Collection />
        <Configurator />
        <Marquee />
        <About />
        <Contact />
      </main>
      <Footer />
      <ProductDialog />
      <CartDrawer />
      <Checkout />
      <LegalDialog />
      <Toast />
      <Cursor />
    </>
  );
}
