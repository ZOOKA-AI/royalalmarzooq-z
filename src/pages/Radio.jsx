import React from 'react';
import { Button } from "@/components/ui/button";
import { Radio as RadioIcon, ExternalLink } from 'lucide-react';

export default function Radio() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <RadioIcon className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">راديو Royal Haroon</h1>
          </div>
          <a 
            href="https://zekr-ai-copy-e8a95db7.base44.app/radio" 
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
          src="https://zekr-ai-copy-e8a95db7.base44.app/radio"
          className="w-full h-full border-0"
          title="راديو Royal Haroon"
        />
      </div>
    </div>
  );
}