"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <DocPage
      eyebrow="Cookie Policy"
      EyebrowIcon={Cookie}
      title="Cookie Policy"
      subtitle="How we use cookies to improve your experience."
      sections={[
        {
          id: "what-are-cookies",
          title: "What are Cookies?",
          content: (
            <p>
              Cookies are small text files stored on your device that help us remember your 
              preferences, keep you logged in, and understand how you interact with our platform.
            </p>
          ),
        },
        {
          id: "types-of-cookies",
          title: "Types of Cookies",
          content: (
            <p>
              We use essential cookies for authentication and performance cookies to 
              understand how you use our site. These allow us to provide a seamless 
              and personalized experience.
            </p>
          ),
        },
      ]}
    />
  );
}
