// app/components/HomeClient.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import heavy components
const TestimonialsCarousel = dynamic(() => import("@/components/testimonials-carousel"), {
  ssr: false,
});
const CommunityExtras = dynamic(() => import("@/components/community-extras"), {
  ssr: false,
});

export default function HomeClient() {
  return (
    <>
      <TestimonialsCarousel />
      <CommunityExtras />
    </>
  );
}
