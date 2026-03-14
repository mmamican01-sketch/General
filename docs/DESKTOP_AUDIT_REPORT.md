# تقرير فحص واجهة الموقع — سطح المكتب (Desktop)

**التاريخ:** فبراير 2026  
**المشروع:** AL Farhan General Trading — موقع Astro + CMS

---

## 1. هيكل المشروع

| المجلد | الوظيفة |
|--------|---------|
| `src/pages/` | صفحات الموقع (en + ar) |
| `src/components/` | Header, Footer, MediaFrame, OptimizedImg, Container |
| `src/layouts/` | BaseLayout (HTML أساسي + Header + Footer) |
| `src/lib/` | contentStore, imageOptimizer, seo |
| `src/content-store/` | محتوى الصفحات (JSON) |
| `src/styles/` | theme.css, tailwind.css, fonts.css |
| `public/assets/figma/` | الصور الأصلية + optimized/ (WebP) |
| `_system/` | MEDIA_INVENTORY, CONTENT_SLOTS |

---

## 2. الصفحات والمسارات

### اللغة الإنجليزية (en)

| المسار | الوصف |
|--------|-------|
| `/en/` | الصفحة الرئيسية — Hero فيديو، أقسام، إحصائيات، بانر |
| `/en/who-we-are` | من نحن |
| `/en/about` | عن الشركة |
| `/en/products` | المنتجات والخدمات (قائمة) |
| `/en/products/[slug]` | تفاصيل منتج (sugar, wheat, oils, urea, maritime-transport) |
| `/en/commodities` | السلع (4 بطاقات: barley, sugar, sunflower-oil, wheat) |
| `/en/commodities/barley` | صفحة شعير |
| `/en/commodities/sugar` | صفحة سكر |
| `/en/commodities/sunflower-oil` | صفحة زيت عباد الشمس |
| `/en/commodities/wheat` | صفحة قمح |
| `/en/sustainability` | الاستدامة |
| `/en/careers` | الوظائف |
| `/en/careers/apply` | التقديم للوظائف |
| `/en/newsroom` | غرفة الأخبار |
| `/en/contact` | اتصل بنا (نموذج + معلومات) |

### اللغة العربية (ar)

نفس الهيكل تحت `/ar/` مع دعم RTL (`dir="rtl"`).

### إعادة التوجيه

- `/` → `/en/` (meta refresh + redirect)

---

## 3. المكونات الرئيسية

| المكون | الوظيفة |
|--------|---------|
| **BaseLayout** | HTML أساسي، viewport، SEO، Header، Footer، slot للمحتوى |
| **Header** | شريط علوي (Apply, Newsroom, Contact, Global sites, Search) + شريط تنقل رئيسي + قائمة جوال (drawer) |
| **Footer** | Logo، روابط (Company, Resources, Legal)، Follow Us، حقوق النشر |
| **MediaFrame** | عرض صور مع srcset، sizes، lazy loading، variant (thumbnail/card/standard/hero) |
| **OptimizedImg** | img محسّن للبانرات والصور الكاملة |
| **Container** | حاوية بعرض محدد |

---

## 4. التصميم والثيم

### المتغيرات (theme.css)

- `--bg-section`: #FFF9EC
- `--accent`: #F59C00
- `--text-heading`: #2F2F2F
- `--text-body`: #4A4A4A
- `--white`: #FFFFFF

### الخطوط

- **Cormorant Garamond** — العناوين
- **Inter** — النصوص والواجهة

### Breakpoints (Tailwind افتراضي)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### استخدامات responsive

- `max-w-[1140px]`, `max-w-[1400px]`, `max-w-[900px]` للمحتوى
- `grid-cols-1 md:grid-cols-12` للشبكات
- `text-3xl sm:text-4xl lg:text-6xl` للنصوص
- `py-12 sm:py-16 lg:py-24` للمسافات
- `hidden md:flex` للقائمة الرئيسية
- `md:hidden` لقائمة الجوال

---

## 5. إدارة المحتوى (CMS)

- **Content slots** لكل صفحة (hero, sections, cards, stats, CTA)
- **Content store** في `src/content-store/en/pages/*.json`
- **Globals** للـ header و footer (header-logo, footer-logo)
- **Collections** للمنتجات (`collections/products/*.md`)

---

## 6. تحسين الصور

- **المعالجة:** Sharp يولد WebP (400, 800, 1200, 1920px)
- **التسليم:** srcset + sizes من MEDIA_INVENTORY
- **المكونات:** MediaFrame، OptimizedImg
- **Fallback:** الصورة الأصلية عند غياب المتغيرات

---

## 7. الوظائف التفاعلية

| العنصر | الحالة |
|--------|--------|
| قائمة الجوال | يعمل (drawer + overlay) |
| نموذج الاتصال | HTML فقط (لا إرسال حالي) |
| زر Search | واجهة فقط |
| زر Global sites | واجهة فقط |
| Hero فيديو | YouTube/Vimeo embed أو فيديو مباشر |
| تبديل اللغة | hreflang موجود، لا زر تبديل في الواجهة |

---

## 8. إمكانية الوصول (a11y)

- `lang` و `dir` في HTML
- `aria-label` للأزرار (Search, Open menu, Close menu)
- `aria-current="page"` للرابط النشط
- `aria-hidden` للعناصر الزخرفية
- `alt` للصور (بعضها فارغ مثل بانر الإحصائيات)

---

## 9. الأداء

- **Build:** static (Astro)
- **الصور:** WebP + srcset + lazy loading
- **الفيديو:** preconnect لـ Vimeo/YouTube
- **الخطوط:** fonts.css

---

## 10. ملاحظات للانتقال لفحص الجوال

### ما هو جاهز

1. **Header:** قائمة جوال (drawer) + زر hamburger
2. **Footer:** شبكة `grid-cols-1 md:grid-cols-12` — عمود واحد على الجوال
3. **الصفحات:** استخدام sm/md/lg في معظم الأماكن
4. **Viewport:** `width=device-width, initial-scale=1`

### ما يحتاج مراجعة على الجوال

1. **Logo:** أبعاد كبيرة `w-[280px] sm:w-[420px] md:w-[560px]` — قد تكون زائدة على شاشات صغيرة
2. **Hero:** `h-[75vh]` — التحقق من الارتفاع على الشاشات الطويلة
3. **بانر الإحصائيات:** شبكة `grid-cols-2 md:grid-cols-12` — عمودان على الجوال
4. **النموذج:** حقول قد تحتاج تحسين للمس
5. **روابط Footer:** بعضها `href="#"` (غير مفعّلة)
6. **النصوص:** التحقق من عدم القص أو التداخل
7. **الصور:** object-cover قد يقطع أجزاء مهمة على الشاشات الضيقة

### روابط قد تكون مكسورة

- Footer: Newsroom `#`, Global sites `#`, Privacy Policy `#`, Terms `#`, Cookie Policy `#`, روابط السوشيال `#`

---

## 11. ملخص الحالة

| الجانب | الحالة |
|--------|--------|
| الهيكل | ✅ منظم |
| الصفحات | ✅ كاملة (en + ar) |
| التصميم | ✅ احترافي |
| Responsive | ✅ أساسي (sm/md/lg) |
| الصور | ✅ محسّنة |
| القائمة الجوال | ✅ تعمل |
| النماذج | ⚠️ واجهة فقط |
| تبديل اللغة | ⚠️ غير مرئي في الواجهة |
| روابط Footer | ⚠️ بعضها placeholder |

**الخلاصة:** الموقع جاهز لفحص واجهة الجوال. يُنصح بمراجعة: Logo، Hero، بانر الإحصائيات، النموذج، والروابط غير المفعّلة.
