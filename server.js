const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_URL = "https://easy-qrgz.onrender.com";

app.use(express.json());

// محاكاة قاعدة بيانات مؤقتة (يُفضل استبدالها بـ MongoDB لاحقاً)
let usersDatabase = [];

app.get('/', (req, res) => {
    res.send('Easy Wallet Server is running with Database support 🚀');
});

// مسار التسجيل (إنشاء حساب جديد لأول مرة)
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "الرجاء إدخال اسم المستخدم وكلمة المرور" });
    }

    // التأكد إن المستخدم مش موجود مسبقاً
    const existingUser = usersDatabase.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ error: "اسم المستخدم مستخدم بالفعل، جرب اسم آخر أو سجل دخولك" });
    }

    // توليد المعرفات الثابتة الخاصة بالمستخدم
    const userId = `${username}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const subAccountId = `all${Math.floor(10000 + Math.random() * 90000)}`;

    const newUser = {
        username,
        password, // ملاحظة: في الإنتاج الحقيقي يجب تشفير كلمة المرور باستخدام bcrypt
        userId,
        subAccountId,
        balance: 12450.00
    };

    usersDatabase.push(newUser);

    res.json({
        message: "تم إنشاء الحساب بنجاح",
        userId: newUser.userId,
        subAccountId: newUser.subAccountId,
        balance: newUser.balance
    });
});

// مسار تسجيل الدخول (لو دخل من جهاز ثاني)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = usersDatabase.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "خطأ في اسم المستخدم أو كلمة المرور" });
    }

    res.json({
        message: "تم تسجيل الدخول بنجاح",
        userId: user.userId,
        subAccountId: user.subAccountId,
        balance: user.balance
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setInterval(async () => {
        try { await fetch(RENDER_URL); } catch (e) {}
    }, 5 * 60 * 1000);
});
