
import React from "react";
import { StorySection } from "./StorySection";
import { useGetEvents } from "@/hooks";


export function StoryTimeline() {
  const { data: events } = useGetEvents();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-fantasy-primary">The Hero's Journey</h1>
        <p className="text-muted-foreground">
          Your adventure begins in a world of endless possibilities, where your choices shape the narrative...
        </p>
      </div>

      <div className="relative">
        {/* Timeline connector */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-fantasy-primary via-fantasy-primary to-transparent" />

        {/* Story sections */}
        <div className="space-y-6">
          {/* AI is typing indicator */}
          <div className="relative pl-10">
            <div className="absolute left-0 top-6 h-8 w-8 rounded-full bg-fantasy-cosmic border-2 border-solana-primary flex items-center justify-center z-10">
              <div className="h-3 w-3 rounded-full bg-solana-primary animate-pulse" />
            </div>

            <div className="bg-fantasy-cosmic/20 rounded-lg border border-fantasy-cosmic/30 p-6 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-solana-secondary rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-solana-secondary rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-solana-secondary rounded-full animate-pulse delay-300"></div>
                <span className="ml-2 text-fantasy-light">AI Game Master is creating your next adventure...</span>
              </div>
            </div>
          </div>

          {events && events?.map((section, index) => (
            <div key={`${section.title}-${index}`} className="relative pl-10">
              {/* Timeline node */}
              <div className="absolute left-0 top-6 h-8 w-8 rounded-full bg-fantasy-cosmic border-2 border-fantasy-primary flex items-center justify-center z-10">
                <div className="h-3 w-3 rounded-full bg-fantasy-primary animate-pulse" />
              </div>

              <StorySection
                title={section.title}
                content={section.description}
                choices={section.choices}
                event={section}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
