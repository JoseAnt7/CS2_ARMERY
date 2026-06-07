import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header } from './components/Header';

import { Footer } from './components/Footer';

import { CSBotWidget } from './components/CSBotWidget';

import { WhaleWatchWidget } from './components/WhaleWatchWidget';

import { CSBotProvider } from './context/CSBotContext';

import { WhaleWatchProvider } from './context/WhaleWatchContext';

import { SiteConfigProvider } from './context/SiteConfigContext';

import { useSiteConfig } from './context/SiteConfigContext';

import { LocaleLayout } from './components/LocaleLayout';

import {

  StripEsPrefixRedirect,

  EnglishRootRedirect,

} from './components/LocaleRedirect';

import { Home } from './Pages/Home';

import { WeaponDetail } from './Pages/WeaponDetail';

import { Auth } from './Pages/Auth';

import { Profile } from './Pages/Profile';

import { Subscriptions } from './Pages/Subscriptions';

import { SubscriptionDetail } from './Pages/SubscriptionDetail';

import { Admin } from './Pages/Admin';

import { LegalNotice } from './Pages/legal/LegalNotice';

import { Privacy } from './Pages/legal/Privacy';

import { Cookies } from './Pages/legal/Cookies';

import { Terms } from './Pages/legal/Terms';

import { Contact } from './Pages/legal/Contact';

import { HowItWorks } from './Pages/info/HowItWorks';

import { About } from './Pages/info/About';

import { GuidesIndex } from './Pages/info/GuidesIndex';

import { BuySkinsSafelyGuide } from './Pages/info/guides/BuySkinsSafelyGuide';

import { MarketComparisonGuide } from './Pages/info/guides/MarketComparisonGuide';

import { Cs2TermsGuide } from './Pages/info/guides/Cs2TermsGuide';

import { VisitTracker } from './components/VisitTracker';

import { CookieConsent } from './components/CookieConsent';

import { AdSenseLoader } from './components/AdSenseLoader';

import { SeoRouteWatcher } from './components/Seo';

import { useLocale } from './hooks/useLocale';

import './styles/layout.css';

import './styles/mobile.css';

import './styles/legal.css';



function getStoredUser() {

  try {

    const raw = localStorage.getItem('user');

    return raw ? JSON.parse(raw) : null;

  } catch {

    return null;

  }

}



function SubscriptionsGate({ children }) {

  const { settings } = useSiteConfig();

  const { to } = useLocale();

  const hideSubsPublic = Boolean(settings?.hide_subscriptions_public);

  const user = getStoredUser();

  const isAdmin = Boolean(user?.is_admin);



  if (hideSubsPublic && !isAdmin) {

    return <Navigate to={to('home')} replace />;

  }



  return children;

}



function App() {

  return (

    <BrowserRouter>

      <SeoRouteWatcher />

      <AdSenseLoader />

      <VisitTracker />

      <WhaleWatchProvider>

        <CSBotProvider>

          <SiteConfigProvider>

            <div className="app-shell">

              <Header />

              <main className="main-content">

                <Routes>

                  {/* Español (default): sin prefijo /es */}

                  <Route element={<LocaleLayout />}>

                    <Route index element={<Home />} />

                    <Route path="arma/:id" element={<WeaponDetail />} />

                    <Route path="como-funciona" element={<HowItWorks />} />

                    <Route path="sobre-nosotros" element={<About />} />

                    <Route path="guias" element={<GuidesIndex />} />

                    <Route path="guias/comprar-skins-cs2-seguro" element={<BuySkinsSafelyGuide />} />

                    <Route path="guias/steam-vs-skinport-vs-dmarket" element={<MarketComparisonGuide />} />

                    <Route path="guias/float-exterior-stattrak" element={<Cs2TermsGuide />} />

                    <Route path="contacto" element={<Contact />} />

                    <Route path="aviso-legal" element={<LegalNotice />} />

                    <Route path="privacidad" element={<Privacy />} />

                    <Route path="cookies" element={<Cookies />} />

                    <Route path="terminos" element={<Terms />} />

                    <Route path="cuenta" element={<Auth />} />

                    <Route path="profile" element={<Profile />} />

                    <Route path="admin" element={<Admin />} />

                    <Route

                      path="suscripciones"

                      element={

                        <SubscriptionsGate>

                          <Subscriptions />

                        </SubscriptionsGate>

                      }

                    />

                    <Route

                      path="suscripciones/:slug"

                      element={

                        <SubscriptionsGate>

                          <SubscriptionDetail />

                        </SubscriptionsGate>

                      }

                    />

                  </Route>



                  {/* Inglés: prefijo /en */}

                  <Route path="en" element={<LocaleLayout />}>

                    <Route index element={<Home />} />

                    <Route path="arma/:id" element={<WeaponDetail />} />

                    <Route path="how-it-works" element={<HowItWorks />} />

                    <Route path="about-us" element={<About />} />

                    <Route path="guides" element={<GuidesIndex />} />

                    <Route path="guides/buy-cs2-skins-safely" element={<BuySkinsSafelyGuide />} />

                    <Route path="guides/steam-vs-skinport-vs-dmarket" element={<MarketComparisonGuide />} />

                    <Route path="guides/float-exterior-stattrak" element={<Cs2TermsGuide />} />

                    <Route path="contact" element={<Contact />} />

                    <Route path="legal-notice" element={<LegalNotice />} />

                    <Route path="privacy" element={<Privacy />} />

                    <Route path="cookies" element={<Cookies />} />

                    <Route path="terms" element={<Terms />} />

                    <Route path="account" element={<Auth />} />

                    <Route path="profile" element={<Profile />} />

                    <Route path="admin" element={<Admin />} />

                    <Route

                      path="subscriptions"

                      element={

                        <SubscriptionsGate>

                          <Subscriptions />

                        </SubscriptionsGate>

                      }

                    />

                    <Route

                      path="subscriptions/:slug"

                      element={

                        <SubscriptionsGate>

                          <SubscriptionDetail />

                        </SubscriptionsGate>

                      }

                    />

                  </Route>



                  {/* /es → sin prefijo */}

                  <Route path="es" element={<StripEsPrefixRedirect />} />

                  <Route path="es/*" element={<StripEsPrefixRedirect />} />



                  {/* Rutas EN sueltas en raíz → /en/… */}

                  <Route path="how-it-works" element={<EnglishRootRedirect />} />

                  <Route path="about-us" element={<EnglishRootRedirect />} />

                  <Route path="guides/*" element={<EnglishRootRedirect />} />

                  <Route path="contact" element={<EnglishRootRedirect />} />

                  <Route path="legal-notice" element={<EnglishRootRedirect />} />

                  <Route path="privacy" element={<EnglishRootRedirect />} />

                  <Route path="terms" element={<EnglishRootRedirect />} />

                  <Route path="account" element={<EnglishRootRedirect />} />

                  <Route path="subscriptions/*" element={<EnglishRootRedirect />} />

                </Routes>

              </main>

              <Footer />

              <CookieConsent />

              <CSBotWidget />

              <WhaleWatchWidget />

            </div>

          </SiteConfigProvider>

        </CSBotProvider>

      </WhaleWatchProvider>

    </BrowserRouter>

  );

}



export default App;


