const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ضع رابط سيرفرك على ريندر هنا بعد ما تاخذه (مثال: https://your-app-name.onrender.com)
const RENDER_URL = "https://easy-qrgz.onrender.com"; 

app.use(express.json());

// مسار رئيسي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send('Easy Wallet Server is running smoothly 🚀');
});

// دالة توليد معرف المستخدم الأساسي: الاسم + 10 أرقام عشوائية
function generateUserId(username) {
    const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${username}${randomNumbers}`;
}

// دالة توليد معرف الحساب الفرعي: all + 5 أرقام عشوائية
function generateSubAccountId() {
    const randomNumbers = Math.floor(10000 + Math.random() * 90000);
    return `all${randomNumbers}`;
}

// مثال لمسار تجريبي لإنشاء حساب مستخدم جديد
app.post('/api/register', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const userId = generateUserId(username);
    const subAccountId = generateSubAccountId();

    res.json({
        message: "User registered successfully",
        userId: userId,
        subAccountId: subAccountId
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // نظام الحفاظ على النشاط (Self-Ping كل 5 دقائق لمنع السيرفر من النوم على ريندر)
    setInterval(async () => {
        if (RENDER_URL.includes("YOUR_RENDER_APP_NAME")) return; // يتخطى الرابط الوهمي حتى تنشر السيرفر
        try {
            const response = await fetch(RENDER_URL);
            console.log(`[Keep-Alive] Self-ping status: ${response.status}`);
        } catch (error) {
            console.error(`[Keep-Alive] Ping failed:`, error.message);
        }
    }, 5 * 60 * 1000); 
});
