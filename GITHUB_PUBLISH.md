# نشر المشروع على GitHub

تم تجهيز المشروع للنشر. اتبع الخطوات التالية:

## الخطوة 1: إنشاء مستودع جديد على GitHub

1. اذهب إلى [github.com/new](https://github.com/new)
2. أدخل اسم المستودع (مثلاً: `Al-Farhan` أو `alfarhan-website`)
3. اختر **Public**
4. **لا** تضف README أو .gitignore — المشروع جاهز بالفعل
5. اضغط **Create repository**

## الخطوة 2: ربط المشروع بالمستودع ورفعه

افتح PowerShell في مجلد المشروع ونفّذ:

```powershell
cd "c:\Users\Usser\Downloads\Al Farhan"

# استبدل YOUR_USERNAME و YOUR_REPO باسم المستخدم واسم المستودع
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# رفع الفرع الرئيسي
git branch -M main
git push -u origin main
```

**مثال:** إذا كان المستودع `https://github.com/ahmed/Al-Farhan`:

```powershell
git remote add origin https://github.com/ahmed/Al-Farhan.git
git branch -M main
git push -u origin main
```

## ملاحظات

- إذا طُلب منك تسجيل الدخول، استخدم **Personal Access Token** بدلاً من كلمة المرور
- يمكنك إنشاء Token من: GitHub → Settings → Developer settings → Personal access tokens
- المشروع يتضمن: Astro_Site، Figma_Make_Export، والتصميم المتجاوب
