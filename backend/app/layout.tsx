export const metadata = { title: "Wolf API", robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#000", color: "#fff", margin: 0 }}>{children}</body>
    </html>
  );
}
