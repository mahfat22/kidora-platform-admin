# Kidora Platform Admin

واجهة عربية مستقلة لإدارة منصة Kidora، تستخدم إعدادات Tailwind ومكونات الأيقونات والثيم الموجودة في المشروع الأصلي دون نسخها أو تعديلها.

## التشغيل المحلي

من مجلد المشروع:

```powershell
Set-Location .\platform-admin
npm run dev
```

يفتح Vite لوحة الإدارة محليًا على `http://127.0.0.1:5174`. المنفذ 5173 مخصص للتطبيق الأصلي.

## الفحص والبناء

```powershell
npm run typecheck
npm run build
```

## تسجيل دخول مدير المنصة

- عنوان Laravel المحلي في `.env` هو `http://kidora.test`، بعد التحقق من عنوان `APP_URL` الفعلي في مشروع Laravel.
- يمرر Vite طلبات `/admin/api` عبر proxy محلي إلى عنوان Laravel؛ لا تُرسل طلبات المتصفح مباشرةً بين أصلين مختلفين.
- يستخدم تسجيل الدخول Session وCSRF cookies عبر `GET /admin/api/csrf-cookie` ثم `POST /admin/api/auth/login`.
- يُفحص الحساب والجلسة عبر `GET /admin/api/auth/me` عند فتح التطبيق، ويُنفذ الخروج عبر `POST /admin/api/auth/logout`.
- لا تُخزن كلمة المرور أو رموز الجلسة في `localStorage`. ملف `.env` محلي ومستثنى من Git؛ استخدم `.env.example` كمرجع إعداد.
- إعداد Vite مقيد بعنوان `http://kidora.test` المحلي لمنع توجيه proxy إلى خادم خارجي.

## الصفحات الحالية

- `/login`: تسجيل دخول مدير المنصة عبر جلسة Laravel.
- `/dashboard`: إجمالي الحضانات من `GET /admin/api/statistics`.
- `/nurseries`: سجلات الحضانات مع البحث والترقيم من `GET /admin/api/nurseries`.

تستخدم صفحة الحضانات بحث الخادم وترقيمه (`search`, `page`, `per_page`)؛ عند تعذر الاتصال أو انتهاء الجلسة لا تعرض بيانات بديلة.
