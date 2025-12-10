import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SocialMediaGenerator() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">مولد صور وأفكار السوشيال ميديا</h1>
          </div>
          <a 
            href="https://royal-cleaning-social-media-planner-341630917425.us-west1.run.app/" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 ml-2" />
              فتح في نافذة جديدة
            </Button>
          </a>
        </div>
      </div>
      
      <div className="flex-1">
        <iframe
          src="https://royal-cleaning-social-media-planner-341630917425.us-west1.run.app/"
          className="w-full h-full border-0"
          title="مولد صور وأفكار"
        />
      </div>
    </div>
  );
}