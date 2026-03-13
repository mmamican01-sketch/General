# E2E Tests - Dashboard

اختبارات شاملة للداشبورد (13 اختبار):

| # | الاختبار | الوصف |
|---|----------|-------|
| 1 | Login: Sign in with valid credentials | تسجيل الدخول بنجاح |
| 2 | Login: Reject invalid credentials | رفض بيانات خاطئة |
| 3 | Edit navigation: Pages → Edit index → back | التنقل وتحرير الصفحة الرئيسية |
| 4 | Save Page (Publish) | تعديل hero-link-label، حفظ، والتحقق على الموقع |
| 5 | Save Global | تعديل Header/Footer |
| 6 | Save Collection | تعديل منتج Sugar والتحقق على الموقع |
| 7 | Create Page | إنشاء صفحة جديدة |
| 8 | Upload Media | رفع صورة |
| 9 | Copy path (Media) | نسخ مسار الملف |
| 10 | Page editor tabs | التبديل بين Content، SEO، Media |
| 11 | Collections navigation | التنقل إلى products → sugar |
| 12 | Globals navigation | التنقل إلى header و footer |
| 13 | Site preview | زر "Open in site" يفتح الموقع |

## تشغيل الاختبارات

```bash
# من مجلد Astro_Site
npm run test:e2e
```

الاختبارات تشغّل الموقع والداشبورد تلقائياً إن لم يكونا يعملان.

## المتطلبات

- `_dashboard/.env.local` مع:
  ```
  DASH_USER=admin
  DASH_PASS=change-this-password
  ```
  (يُنشأ تلقائياً عند أول تشغيل)

## تشغيل الاختبارات مع واجهة تفاعلية

```bash
npm run test:e2e:ui
```
