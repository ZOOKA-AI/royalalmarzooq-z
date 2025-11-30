import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Instagram, Facebook, Globe, ExternalLink } from 'lucide-react';

const socialLinks = [
  {
    name: 'واتساب',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
    url: 'https://wa.me/971563177803',
  },
  {
    name: 'اتصال مباشر',
    icon: Phone,
    color: 'bg-blue-500 hover:bg-blue-600',
    url: 'tel:+971563177803',
  },
  {
    name: 'انستغرام',
    icon: Instagram,
    color: 'bg-pink-500 hover:bg-pink-600',
    url: 'https://instagram.com/royalclean_uae',
  },
  {
    name: 'فيسبوك',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    url: 'https://facebook.com/royalcleanuae',
  },
];

export default function SocialLinks() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          روابط التواصل
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className={`w-full ${link.color} text-white flex items-center justify-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}