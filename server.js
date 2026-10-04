const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_URL = "https://easy-qrgz.onrender.com";

app.use(express.json());

// قاعدة بيانات مؤقتة لتخزين الحسابات
let usersDatabase = [];

app.get('/', (req, res) => {
    res.send('Easy Wallet Server is running smoothly 🚀');
});

// دالة لتوليد عنوان محفظة وهمي/حقيقي مشفر خاص بالمنصة (Custodial Address)
function generateCustodialWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// مسار التسجيل (إنشاء حساب جديد كلياً من السيرفر)
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "الرجاء إدخال اسم المستخدم وكلمة المرور" });
    }

    const existingUser = usersDatabase.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ error: "اسم المستخدم مستخدم بالفعل، جرب تسجيل الدخول" });
    }

    // توليد المعرفات المطلوبة
    const userId = `${username}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const subAccountId = `all${Math.floor(10000 + Math.random() * 90000)}`;
    const walletAddress = generateCustodialWalletAddress(); // محفظة فرعية تنشأ تلقائياً للمستخدم

    const newUser = {
        username,
        password,
        userId,
        subAccountId,
        walletAddress,
        balance: 0.00
    };

    usersDatabase.push(newUser);

    res.json({
        message: "تم إنشاء الحساب والمحفظة بنجاح",
        userId: newUser.userId,
        subAccountId: newUser.subAccountId,
        walletAddress: newUser.walletAddress,
        balance: newUser.balance
    });
});

// مسار تسجيل الدخول (لو دخل من جهاز ثاني بنفس الاسم والباسورد)
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
        walletAddress: user.walletAddress,
        balance: user.balance
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setInterval(async () => {
        try { await fetch(RENDER_URL); } catch (e) {}
    }, 5 * 60 * 1000);
});
