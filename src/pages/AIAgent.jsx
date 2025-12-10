import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink } from 'lucide-react';

export default function AIAgent() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">الوكيل الذكي</h1>
          </div>
          <a 
            href="https://business.gemini.google/home/cid/6076beba-50e2-4e65-b1ce-7870f18075aa/r/agent/4647311030204214429/session/-?csesidx=845748281" 
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
          src="https://business.gemini.google/home/cid/6076beba-50e2-4e65-b1ce-7870f18075aa/r/agent/4647311030204214429/session/-?csesidx=845748281"
          className="w-full h-full border-0"
          title="الوكيل الذكي"
        />
      </div>
    </div>
  );
}