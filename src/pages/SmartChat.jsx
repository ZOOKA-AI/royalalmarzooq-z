import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from 'lucide-react';

export default function SmartChat() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">المحادثة الذكية</h1>
          </div>
          <a 
            href="https://zookaai-kmw5yk7r.manus.space/chat" 
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
          src="https://zookaai-kmw5yk7r.manus.space/chat"
          className="w-full h-full border-0"
          title="المحادثة الذكية"
        />
      </div>
    </div>
  );
}