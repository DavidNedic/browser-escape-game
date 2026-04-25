import { createFileRoute } from "@tanstack/react-router";
import { EscapeGame } from "@/components/escape/EscapeGame";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Browser Escape — Drei Räume, ein Ausgang" },
      {
        name: "description",
        content:
          "Ein minimalistisches Browser-Escape-Spiel. Klicken, scrollen, suchen — finde das Licht.",
      },
      { property: "og:title", content: "Browser Escape — Drei Räume, ein Ausgang" },
      {
        property: "og:description",
        content: "Ein minimalistisches Browser-Escape-Spiel im Dark Mode.",
      },
    ],
  }),
});

function Index() {
  return <EscapeGame />;
}
