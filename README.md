# 🌐 معرّب (Arabizer)

أداة مفتوحة المصدر لتعريب أي موقع أو نص عربي — **مجانية، بدون إعلانات، بدون خوادم، بدون تتبع**.

## ✨ الميزات
- ترجمة فورية لأي صفحة ويب بضغطة زر (سكربت Tampermonkey).
- تطبيق ويب خفيف يعمل على GitHub Pages.
- استرجاع النص الأصلي في أي وقت.
- لا يجمع أي بيانات.
- يعمل بالكامل في المتصفح.

## 🚀 التثبيت

### 1) تطبيق الويب (GitHub Pages)
1. ارفع `index.html` إلى مستودع على GitHub.
2. Settings → Pages → Branch: `main` / `root` → Save.
3. افتح الرابط الناتج: `https://YOUR_USERNAME.github.io/arabizer/`

### 2) سكربت تعريب المواقع (Tampermonkey)
1. ثبّت [Tampermonkey](https://www.tampermonkey.net/).
2. افتح لوحة التحكم → **Create a new script**.
3. الصق محتوى `arabizer.user.js` واحفظ.
4. زرّ **🌐 عرّب** سيظهر في كل موقع تزوره.

## 🧠 كيف يعمل؟
يستخدم واجهة الترجمة العامة `translate.googleapis.com/translate_a/single`
(بدون مفتاح API، مجانية، تدعم CORS).

## 📜 الترخيص
MIT — استخدم، عدّل، وانشر بحرية.
