const endpoints = [
  ["GET", "/api/health", "Database connectivity check"],
  ["GET", "/api/site", "Site content (hero, stores, team, awards, partners...)"],
  ["GET", "/api/categories", "Product categories with counts"],
  ["GET", "/api/categories/:slug", "Single category"],
  ["GET", "/api/products?category=&q=&sort=&min=&max=&page=&limit=", "Product listing"],
  ["GET", "/api/products/:slug", "Product detail + related products"],
  ["POST", "/api/contact", "Contact form"],
  ["POST", "/api/newsletter", "Newsletter signup"],
  ["POST", "/api/orders", "Place an order"],
  ["GET", "/api/orders", "My orders (Bearer token)"],
  ["POST", "/api/orders/track", "Track an order by number + email"],
  ["POST", "/api/auth/register", "Create account"],
  ["POST", "/api/auth/login", "Sign in"],
  ["GET", "/api/auth/me", "Current account (Bearer token)"],
];

export default function Home() {
  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "48px 16px" }}>
      <h1 style={{ color: "#FCAD38", margin: 0 }}>Wolf API</h1>
      <p style={{ color: "#99A1AF" }}>Backend for the Wolf storefront. Admin-only write routes require an admin Bearer token.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {endpoints.map(([m, p, d]) => (
            <tr key={m + p} style={{ borderBottom: "1px solid #222" }}>
              <td style={{ padding: "10px 8px", color: "#FCAD38", fontWeight: 700 }}>{m}</td>
              <td style={{ padding: "10px 8px", fontFamily: "monospace" }}>{p}</td>
              <td style={{ padding: "10px 8px", color: "#99A1AF" }}>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
