import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageMetadata = {
  Dashboard: {
    title: 'لوحة التحكم | رويال - نظام إدارة الأعمال بالذكاء الاصطناعي',
    description: 'لوحة تحكم ذكية لإدارة شركات التنظيف والصيانة بتقنيات AI متقدمة. تتبع الطلبات، العملاء، والإيرادات في الوقت الفعلي.',
    keywords: 'لوحة تحكم, إدارة أعمال, ذكاء اصطناعي, نظام إدارة, دبي'
  },
  Orders: {
    title: 'إدارة الطلبات | رويال',
    description: 'نظام متطور لإدارة طلبات التنظيف والصيانة. تتبع الحالة، الدفع، والعمال بكفاءة عالية.',
    keywords: 'إدارة طلبات, نظام حجز, تتبع طلبات, خدمات تنظيف'
  },
  Clients: {
    title: 'إدارة العملاء | رويال',
    description: 'نظام CRM متكامل لإدارة بيانات العملاء، سجل الطلبات، وبرامج الولاء.',
    keywords: 'إدارة عملاء, CRM, برنامج ولاء, قاعدة بيانات عملاء'
  },
  Pricing: {
    title: 'الأسعار والخطط | رويال - ابدأ مجاناً',
    description: 'خطط أسعار مرنة تناسب جميع الشركات. من المجاني إلى المؤسسات. بدون رسوم خفية.',
    keywords: 'أسعار, خطط اشتراك, تسعير, باقات, مجاني, اشتراك شهري'
  },
  About: {
    title: 'من نحن | رويال - قصتنا ورؤيتنا',
    description: 'تعرف على رويال - المنصة الرائدة في إدارة أعمال التنظيف بالذكاء الاصطناعي في الإمارات.',
    keywords: 'من نحن, رويال, قصة الشركة, رؤية, مهمة, فريق العمل'
  },
  Privacy: {
    title: 'سياسة الخصوصية | رويال',
    description: 'نلتزم بحماية بياناتك. اقرأ سياسة الخصوصية الشاملة لفهم كيف نجمع ونحمي معلوماتك.',
    keywords: 'خصوصية, حماية البيانات, أمان, GDPR, تشفير'
  },
  Terms: {
    title: 'شروط الاستخدام | رويال',
    description: 'الشروط والأحكام القانونية لاستخدام منصة رويال. اقرأها بعناية قبل البدء.',
    keywords: 'شروط استخدام, أحكام, اتفاقية, قانوني'
  },
  Blog: {
    title: 'مدونة رويال | نصائح وأفكار لإدارة الأعمال',
    description: 'مقالات متخصصة في إدارة أعمال التنظيف، التسويق، الذكاء الاصطناعي، وقصص النجاح.',
    keywords: 'مدونة, مقالات, نصائح إدارة, تسويق, ذكاء اصطناعي'
  },
  Landing: {
    title: 'رويال | نظام إدارة الأعمال بالذكاء الاصطناعي - دبي، الإمارات',
    description: 'منصة شاملة لإدارة شركات التنظيف والصيانة في الإمارات. AI متقدم، تتبع GPS، تقارير ذكية، وأكثر. ابدأ مجاناً!',
    keywords: 'نظام إدارة أعمال, ذكاء اصطناعي, شركات تنظيف, دبي, الإمارات, CRM, تتبع GPS, إدارة طلبات'
  },
  Licenses: {
    title: 'التراخيص والشهادات | رويال',
    description: 'جميع التراخيص الرسمية، الشهادات، وحقوق الملكية الفكرية لشركة رويال.',
    keywords: 'تراخيص, شهادات, ISO, حقوق نشر, ملكية فكرية'
  }
};

export default function SEOHead({ pageName }) {
  const location = useLocation();
  
  useEffect(() => {
    const metadata = pageMetadata[pageName] || {
      title: 'رويال | نظام إدارة الأعمال',
      description: 'منصة ذكية لإدارة أعمال التنظيف والصيانة',
      keywords: 'إدارة أعمال, ذكاء اصطناعي, دبي'
    };

    // Set page title
    document.title = metadata.title;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = metadata.description;

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = metadata.keywords;

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: 'رويال' },
      { property: 'og:locale', content: 'ar_AE' },
      { property: 'og:image', content: 'https://royal-cleaning.com/og-image.jpg' }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.title },
      { name: 'twitter:description', content: metadata.description },
      { name: 'twitter:image', content: 'https://royal-cleaning.com/twitter-image.jpg' }
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.name = tag.name;
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Language and direction
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';

    // Schema.org structured data
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "رويال",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "AED"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "500"
      },
      "description": metadata.description
    };

    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);

  }, [pageName, location]);

  return null;
}