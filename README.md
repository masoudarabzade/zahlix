<!-- ENGLISH SECTION - LTR -->
<div dir="ltr">

# ZAHLIX - German Numbers Listening Practice

ZAHLIX is an interactive web application designed to help learners improve their listening comprehension of German numbers. Whether you're a beginner or advanced, ZAHLIX provides an engaging way to practice numbers, prices, dates, and times in German.

**Live Demo:** [https://zahlix.42web.io](https://zahlix.42web.io)

![GitHub stars](https://img.shields.io/github/stars/masoudarabzade/zahlix?style=flat-square&logo=github)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Files in the Current Project:

### 1. HTML Files:

**index.html**: The main page of the ZAHLIX application. It includes the start screen, difficulty selection, mode selection, and practice session screens. The structure supports multilingual UI (German, English, Persian) and dark/light mode theming.

### 2. CSS Files:

**styles.css**: Defines the complete visual design of ZAHLIX. It uses CSS variables for theming, Flexbox and Grid for responsive layouts, and includes dedicated styles for RTL (Persian) support. The design is fully responsive across mobile, tablet, and desktop devices.

### 3. JavaScript Files:

**script.js**: The main application logic. Manages the practice sessions, audio playback, answer validation, difficulty levels, user preferences, and screen navigation.

**sounds.js**: Handles all audio-related functionality including playback speed control (0.5x to 2.0x), sound file management, and audio caching.

**file-list.js**: Manages the list of available audio files across 8 different practice modes.

**lang/translations.js**: Contains all multilingual content for German, English, and Persian interfaces.

---

## Practice Modes:

ZAHLIX offers 8 different practice modes to cover all aspects of German numbers:

| Mode | Description | Sample |
|------|-------------|--------|
| **Integers** | Single and multi-digit numbers | 123 |
| **Decimals** | Decimal numbers | 12.5 |
| **Dates** | German date formats | 01.oktober |
| **Date Ranges** | Date periods | 01.oktober bis 15.dezember |
| **Times** | German time expressions | 14:30 |
| **Time Ranges** | Time periods | 10:00 bis 14:30 |
| **Prices** | Euro amounts | 12.50€ |
| **Years** | Year numbers | 2023 |

---

## Difficulty Levels:

| Level | Number Range | Available Modes |
|-------|-------------|-----------------|
| **Easy** | 0-99 | Integers, Dates, Times, Prices, Years |
| **Medium** | 0-999 | All 8 modes |
| **Hard** | 10-9999 | All 8 modes |

---

## Key Features:

- 🎧 **500+ Authentic German Audio Files** – Real pronunciation by native speakers
- 🎚️ **3 Difficulty Levels** – Easy, Medium, Hard with adaptive number ranges
- 📱 **8 Practice Modes** – Comprehensive coverage of German number usage
- ⚡ **Adjustable Playback Speed** – 0.5x to 2.0x for gradual learning
- 🌓 **Dark/Light Mode** – Eye-friendly interface for day and night
- 📱 **Fully Responsive** – Perfect on mobile, tablet, and desktop
- 🗣️ **Multilingual UI** – German, English, Persian (Farsi)
- 💾 **Persistent Settings** – Saves theme, language, and difficulty preferences
- ⭐ **GitHub Integration** – Real-time star counter via GitHub API

---

## Project Structure:

```
zahlix/
├── index.html              # Main application page
├── styles.css              # Complete styling system
├── script.js               # Core application logic
├── sounds.js               # Audio playback manager
├── file-list.js            # Audio files registry
├── .gitignore              # Version control ignore file
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── lang/                   # Multilingual translations
│   └── translations.js     # German, English, Persian texts
├── file/                   # Audio files directory
│   ├── number/             # Integer and decimal numbers
│   ├── date/               # Dates and date ranges
│   ├── time/               # Times and time ranges
│   ├── preis/              # Euro prices
│   └── jahres/             # Years
├── img/                    # Image assets
│   ├── logo.png
│   └── icon.ico
└── server/                 # Backend API (optional)
    └── get-files.php       # PHP file server
```

---

## Local Setup:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/masoudarabzade/zahlix.git
   cd zahlix
   ```

2. **Open with a local server:**
   - Use Live Server in VS Code
   - Or run with PHP: `php -S localhost:8000`
   - Or open index.html directly in browser

3. **Start practicing!**
   - Select difficulty level
   - Choose practice modes
   - Listen and answer

---

## Technical Stack:

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | CSS Variables, Flexbox, Grid |
| **Icons** | Font Awesome 6 |
| **Fonts** | Inter (Latin), Vazir (Persian) |
| **Audio** | Web Audio API |
| **Hosting** | InfinityFree (PHP 8.x) |
| **Version Control** | Git, GitHub |
| **API** | GitHub REST API |

---

## Contributing:

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Developer:

**Masoud Arabzadeh**

[![Telegram](https://img.shields.io/badge/Telegram-@mrx2024-26A5E4?style=flat-square&logo=telegram)](https://t.me/mrx2024)
[![GitHub](https://img.shields.io/badge/GitHub-@masoudarabzade-181717?style=flat-square&logo=github)](https://github.com/masoudarabzade)

---

## Star on GitHub:

If you find this project helpful, please give it a star on GitHub! ⭐

[**👉 Star ZAHLIX on GitHub**](https://github.com/masoudarabzade/zahlix)

---

**Happy Learning!** 🚀

</div>

---

<!-- ---------------------------------------------------------------------- -->
<!-- PERSIAN SECTION - RTL -->
<!-- ---------------------------------------------------------------------- -->

<div dir="rtl">

# ZAHLIX - تمرین شنیداری اعداد آلمانی

**ZAHLIX** یک برنامه وب تعاملی برای تمرین و تقویت مهارت شنیداری اعداد آلمانی است. چه مبتدی باشید و چه پیشرفته، ZAHLIX روشی جذاب برای تمرین اعداد، قیمت‌ها، تاریخ‌ها و ساعت‌ها به زبان آلمانی ارائه می‌دهد.

**نمایش زنده:** [https://zahlix.42web.io](https://zahlix.42web.io)

![GitHub stars](https://img.shields.io/github/stars/masoudarabzade/zahlix?style=flat-square&logo=github)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## فایل‌های موجود در پروژه:

### ۱. فایل‌های HTML:

**index.html**: صفحه اصلی برنامه ZAHLIX. شامل صفحه شروع، انتخاب سطح سختی، انتخاب حالت تمرین و صفحه تمرین اصلی است. ساختار این فایل از رابط کاربری سه‌زبانه (آلمانی، انگلیسی، فارسی) و تم شب/روز پشتیبانی می‌کند.

### ۲. فایل‌های CSS:

**styles.css**: طراحی کامل ظاهری ZAHLIX را تعریف می‌کند. از متغیرهای CSS برای تم‌بندی، Flexbox و Grid برای چیدمان واکنش‌گرا استفاده می‌کند و شامل استایل‌های اختصاصی برای پشتیبانی از زبان فارسی (RTL) است. طراحی کاملاً واکنش‌گرا بوده و در موبایل، تبلت و دسکتاپ به خوبی نمایش داده می‌شود.

### ۳. فایل‌های JavaScript:

**script.js**: منطق اصلی برنامه است. جلسات تمرین، پخش صدا، اعتبارسنجی پاسخ‌ها، سطوح سختی، تنظیمات کاربر و ناوبری بین صفحات را مدیریت می‌کند.

**sounds.js**: تمام عملکردهای مرتبط با صدا از جمله کنترل سرعت پخش (۰.۵x تا ۲.۰x)، مدیریت فایل‌های صوتی و کش کردن صداها را انجام می‌دهد.

**file-list.js**: لیست فایل‌های صوتی موجود در ۸ حالت مختلف تمرینی را مدیریت می‌کند.

**lang/translations.js**: تمام محتوای چندزبانه برای رابط‌های آلمانی، انگلیسی و فارسی را شامل می‌شود.

---

## حالت‌های تمرینی:

ZAHLIX دارای ۸ حالت تمرینی مختلف برای پوشش کامل اعداد آلمانی است:

| حالت تمرین | توضیحات | مثال |
|------------|--------|------|
| **اعداد صحیح** | اعداد یک تا چند رقمی | ۱۲۳ |
| **اعداد اعشاری** | اعداد با ممیز | ۱۲.۵ |
| **تاریخ** | فرمت تاریخ آلمانی | ۰۱.اکتبر |
| **بازه تاریخی** | بازه‌های زمانی | ۰۱.اکتبر تا ۱۵.دسامبر |
| **ساعت** | بیان زمان به آلمانی | ۱۴:۳۰ |
| **بازه زمانی** | بازه‌های ساعتی | ۱۰:۰۰ تا ۱۴:۳۰ |
| **قیمت** | مبالغ به یورو | ۱۲.۵۰€ |
| **سال** | اعداد سال | ۲۰۲۳ |

---

## سطوح سختی:

| سطح | محدوده اعداد | حالت‌های قابل دسترس |
|-----|-------------|---------------------|
| **آسان** | ۰-۹۹ | اعداد صحیح، تاریخ، ساعت، قیمت، سال |
| **متوسط** | ۰-۹۹۹ | هر ۸ حالت |
| **سخت** | ۱۰-۹۹۹۹ | هر ۸ حالت |

---

## ویژگی‌های کلیدی:

- 🎧 **بیش از ۵۰۰ فایل صوتی اصیل آلمانی** – تلفظ واقعی توسط گویندگان بومی
- 🎚️ **۳ سطح سختی** – آسان، متوسط، سخت با محدوده‌های تطبیقی
- 📱 **۸ حالت تمرین** – پوشش کامل کاربرد اعداد در آلمانی
- ⚡ **قابلیت تنظیم سرعت پخش** – ۰.۵x تا ۲.۰x برای یادگیری تدریجی
- 🌓 **حالت شب/روز** – طراحی مناسب برای چشم در روز و شب
- 📱 **طراحی کاملاً واکنش‌گرا** – عالی در موبایل، تبلت و کامپیوتر
- 🗣️ **رابط کاربری سه‌زبانه** – آلمانی، انگلیسی، فارسی
- 💾 **ذخیره تنظیمات** – تم، زبان و سطح سختی ذخیره می‌شود
- ⭐ **ادغام با گیت‌هاب** – نمایش تعداد واقعی ستاره‌ها با GitHub API

---

## ساختار پروژه:

```
zahlix/
├── index.html              # صفحه اصلی برنامه
├── styles.css              # سیستم استایل‌دهی کامل
├── script.js               # منطق اصلی برنامه
├── sounds.js               # مدیریت پخش صدا
├── file-list.js            # ثبت فایل‌های صوتی
├── .gitignore              # فایل نادیده‌گیری گیت
├── README.md               # مستندات پروژه
├── LICENSE                 # مجوز MIT
├── lang/                   # ترجمه‌های چندزبانه
│   └── translations.js     # متون آلمانی، انگلیسی، فارسی
├── file/                   # دایرکتوری فایل‌های صوتی
│   ├── number/             # اعداد صحیح و اعشاری
│   ├── date/               # تاریخ‌ها و بازه‌های تاریخی
│   ├── time/               # ساعت‌ها و بازه‌های زمانی
│   ├── preis/              # قیمت‌ها به یورو
│   └── jahres/             # سال‌ها
├── img/                    # تصاویر
│   ├── logo.png
│   └── icon.ico
└── server/                 # API سمت سرور (اختیاری)
    └── get-files.php       # سرور فایل PHP
```

---

## نصب محلی:

۱. **کلون کردن مخزن:**
   ```bash
   git clone https://github.com/masoudarabzade/zahlix.git
   cd zahlix
   ```

۲. **اجرا با سرور محلی:**
   - استفاده از Live Server در VS Code
   - یا اجرا با PHP: `php -S localhost:8000`
   - یا باز کردن مستقیم index.html در مرورگر

۳. **شروع تمرین:**
   - انتخاب سطح سختی
   - انتخاب حالت‌های تمرین
   - گوش دادن و پاسخ‌دهی

---

## تکنولوژی‌های استفاده شده:

| بخش | تکنولوژی |
|-----|----------|
| **فرانت‌اند** | HTML5, CSS3, JavaScript (ES6+) |
| **استایل‌دهی** | CSS Variables, Flexbox, Grid |
| **آیکون‌ها** | Font Awesome 6 |
| **فونت‌ها** | Inter (لاتین), وزیر (فارسی) |
| **صدا** | Web Audio API |
| **هاست** | InfinityFree (PHP 8.x) |
| **ورژن کنترل** | Git, GitHub |
| **API** | GitHub REST API |

---

## مشارکت:

مشارکت شما پذیرفته می‌شود! لطفاً Pull Request ارسال کنید.

۱. مخزن را Fork کنید
۲. برنچ ویژگی خود را ایجاد کنید (`git checkout -b feature/amazing-feature`)
۳. تغییرات خود را Commit کنید (`git commit -m 'Add some amazing feature'`)
۴. برنچ خود را Push کنید (`git push origin feature/amazing-feature`)
۵. Pull Request باز کنید

---

## مجوز:

این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات بیشتر فایل [LICENSE](LICENSE) را مشاهده کنید.

---

## توسعه‌دهنده:

**مسعود عرب‌زاده**

[![Telegram](https://img.shields.io/badge/Telegram-@mrx2024-26A5E4?style=flat-square&logo=telegram)](https://t.me/mrx2024)
[![GitHub](https://img.shields.io/badge/GitHub-@masoudarabzade-181717?style=flat-square&logo=github)](https://github.com/masoudarabzade)

---

## ستاره در گیت‌هاب:

اگر این پروژه را مفید می‌دانید، لطفاً در گیت‌هاب به آن ستاره دهید! ⭐

[**👉 ستاره دادن به ZAHLIX در گیت‌هاب**](https://github.com/masoudarabzade/zahlix)

---

**یادگیری لذت‌بخشی داشته باشید!** 🚀

</div>
