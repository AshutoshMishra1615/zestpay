import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ZestPay",
  description: "Smart EWA Platform for Indian Workers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} antialiased font-inter`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
