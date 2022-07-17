import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import defaultStyles from "app/styles/index.css";
import styles from "./tailwind.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: defaultStyles },
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="app h-screen flex flex-col antialiased relative">
          <Header />
          <div className="bg-slate-50 flex flex-1 overflow-x-auto lg:overflow-hidden p-0">
            <Sidebar />
            <div className="w-full overflow-y-auto scrollbar flush-bottom">
              <Outlet />
            </div>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
