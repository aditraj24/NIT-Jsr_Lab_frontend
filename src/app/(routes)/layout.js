import { Noto_Sans_Display } from "next/font/google";
import { NewsProvider } from "@/contexts/NewsContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
// import LayoutClient from "@/components/LayoutClient/LayoutClient";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/navbar";
// import { MobileNavbar } from "@/components/MobileNavbar/mobileNavbar";

const sans = Noto_Sans_Display({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <NewsProvider>
      <AdminAuthProvider>
        <html lang="en">
          <body className={`${sans.className} bg-gray-50`}>
            
            <Navbar />
            {children}
            <Footer />
          </body>
        </html>
      </AdminAuthProvider>
    </NewsProvider>
  );
}