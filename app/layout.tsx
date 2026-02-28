import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForsythKidsGuide — Where Forsyth Families Find Their Fit",
  description:
    "Take our free 2-minute quiz and get personalized recommendations from 300+ kids activities in Forsyth County, GA. Dance, sports, STEM, music, tutoring, and more.",
  openGraph: {
    title: "Find the Perfect Activity for Your Child in Forsyth County",
    description:
      "Free 2-minute quiz → personalized recommendations from 300+ kids activities in Cumming & Forsyth County, GA.",
    type: "website",
    locale: "en_US",
    siteName: "ForsythKidsGuide",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
