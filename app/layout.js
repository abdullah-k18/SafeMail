import { Inter } from "next/font/google";
import "./globals.css";
import 'regenerator-runtime/runtime';

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SafeMail</title>
        <link rel="shortcut icon" href="https://cdn3.iconfinder.com/data/icons/antivirus-internet-security-thick-colored-version/33/email_scanning-512.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
