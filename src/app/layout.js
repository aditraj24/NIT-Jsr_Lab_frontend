import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; //  single client boundary
import Footer from "@/components/Footer/Footer";

const sans = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata = {
  title: "MVI Lab",
  description: "Machine Learning Vision Lab at NIT Jamshedpur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sans.className} bg-gray-50`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
