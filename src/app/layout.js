import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";
import { NewsProvider } from "@/contexts/NewsContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import LayoutClient from "@/components/LayoutClient/LayoutClient";
import Footer from "@/components/Footer/Footer";

const sans = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata = {
  title: "MVI Lab",
  description: "Machine Learning Vision Lab at NIT Jamshedpur",
};

export default function RootLayout({ children }) {
  return (
    <NewsProvider>
      <AdminAuthProvider>
        <html lang="en">
          <body className={`${sans.className} bg-gray-50`}>
            <LayoutClient>{children}</LayoutClient>
            <Footer />
          </body>
        </html>
      </AdminAuthProvider>
    </NewsProvider>
  );
}