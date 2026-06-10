import "./globals.css";

export const metadata = {
  title: "Shadow Alchemy — Daily Codex",
  description: "Daily Subconscious Integration Protocols and Mental Biohacking",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shadow Alchemy",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-void antialiased">{children}</body>
    </html>
  );
}