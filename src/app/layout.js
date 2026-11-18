import "./globals.css";

export const metadata = {
  title: "Mu'amar Zulkifli - IPIPortofolio | Web Developer & Desainer",
  description: "Portofolio interaktif & modern karya Mu'amar Zulkifli. Eksplorasi projek web, aplikasi servis bengkel Motocare, e-commerce, dan layanan teknologi.",
  icons: {
    icon: '/portfolio-assets/img/favicon.png',
    apple: '/portfolio-assets/img/apple-touch-icon.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
