import EnvironmentalMonitoring from "./routes/environmental-monitoring";
import { AuthProvider, AdminGate } from "./admin/Auth";
import Login from "./admin/Login";
import { CmsDashboard } from "./visual-cms/CmsDashboard";
import React, { useEffect, useState } from "react";
import { SiteFonts } from "./lib/site-fonts";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./lib/i18n";
import { SiteHeader, SiteFooter } from "./components/site/Chrome";
import { VisualCmsProvider, VisualCmsLayer } from "./visual-cms/VisualCms";
import "./styles.css";
import { Route as Home } from "./routes/index";
import { Route as About } from "./routes/about";
import { Route as Research } from "./routes/research";
import { Route as Publications } from "./routes/publications";
import { Route as Events } from "./routes/events";
import { Route as Membership } from "./routes/membership";
import { Route as GeoData } from "./routes/geodata";
import { Route as News } from "./routes/news";
import { Route as Contact } from "./routes/contact";
import { Route as Dashboard } from "./routes/dashboard";
import { LexiconEmbed } from "./visual-cms/LexiconEmbed";
const MiningPortal = React.lazy(() => import("./features/mining/MiningPortal"));
const GeoparkExplorer = React.lazy(
  () => import("./features/geopark/GeoparkExplorer"),
);
import NewsItem from "./routes/news-item";
import ArticleReader from "./admin/PublicPosts";
import ResearchTopic from "./routes/research-topic";
import PublicationView from "./routes/publication-view";
import WordPressAdmin from "./admin/WordPressAdmin";
const AdminDashboard = () => (
  <AdminGate>
    <WordPressAdmin />
  </AdminGate>
);
const pages: Record<string, React.ComponentType<any>> = {
  "/admin/login": Login,
  "/admin": AdminDashboard,
  "/admin/cms": AdminDashboard,
  "/wp-admin": AdminDashboard,
  "/": Home.component,
  "/about": About.component,
  "/research": Research.component,
  "/publications": Publications.component,
  "/events": Events.component,
  "/membership": Membership.component,
  "/geodata": GeoData.component,
  "/environmental-monitoring": EnvironmentalMonitoring,
  "/news": News.component,
  "/contact": Contact.component,
  "/dashboard": Dashboard.component,
  "/lexicon": LexiconEmbed,
  "/geopark": GeoparkExplorer,
  "/mining": MiningPortal,
  "/articles/read": ArticleReader,
  "/news/item": NewsItem,
  "/research/topic": ResearchTopic,
  "/publications/view": PublicationView,
};
function App() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const cb = () => setPath(location.pathname);
    addEventListener("popstate", cb);
    return () => removeEventListener("popstate", cb);
  }, []);
  const Page = pages[path];
  const adminScreen = path.startsWith("/admin") || path.startsWith("/wp-admin");
  return (
    <I18nProvider>
      <AuthProvider>
        <VisualCmsProvider>
          <SiteFonts />
          {!adminScreen && <SiteHeader />}
          <main id="main">
            {Page ? (
              <React.Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center p-12">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                  </div>
                }
              >
                <Page />
              </React.Suspense>
            ) : (
              <div className="mx-auto max-w-5xl px-4 py-24">
                <h1 className="text-3xl">Page not found</h1>
                <a href="/">Home</a>
              </div>
            )}
          </main>
          {!adminScreen && <SiteFooter />}
          <VisualCmsLayer page={path} />
        </VisualCmsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
