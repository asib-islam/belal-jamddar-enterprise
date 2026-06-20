# 🛒 Belal Jamddar Enterprise

![Logo](/public/logo.png)

> একটি পূর্ণাঙ্গ ই-কমার্স প্ল্যাটফর্ম - আপনার ব্যবসার জন্য তৈরি

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://belal-jamddar-enterprise.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌐 লাইভ ডেমো

👉 [**Belal Jamddar Enterprise**](https://belal-jamddar-enterprise.vercel.app)

**অ্যাডমিন লগইন:** `/admin/login`

---

## ✨ ফিচারসমূহ

### 👥 কাস্টমার ফিচার
- 🔍 **স্মার্ট সার্চ** - টাইটেল ও ডেসক্রিপশন অনুযায়ী সার্চ
- 📦 **ইনফিনিটি স্ক্রল** - স্ক্রল করলেই নতুন প্রোডাক্ট লোড
- 🖼️ **একাধিক ছবি** - প্রোডাক্টের একাধিক ছবি দেখুন
- 💬 **WhatsApp অর্ডার** - সরাসরি WhatsApp-এ অর্ডার করুন
- 💳 **পেমেন্ট অপশন** - bKash, Nagad, Rocket
- 📱 **মোবাইল ফ্রেন্ডলি** - সব ডিভাইসে সাপোর্ট

### 🔐 অ্যাডমিন ফিচার
- 📊 **ড্যাশবোর্ড** - সম্পূর্ণ স্ট্যাটাস ও কন্ট্রোল
- ➕ **প্রোডাক্ট অ্যাড** - একাধিক ছবি সহ প্রোডাক্ট যোগ
- ✏️ **প্রোডাক্ট এডিট** - যেকোনো সময় প্রোডাক্ট আপডেট
- 🗑️ **বাল্ক ডিলিট** - একসাথে একাধিক প্রোডাক্ট ডিলিট
- 👥 **ইউজার ম্যানেজমেন্ট** - অ্যাডমিন যোগ/রিমুভ ও পারমিশন
- ⚙️ **সেটিংস** - স্টোরের সব সেটিংস কন্ট্রোল

---

## 🛠️ টেকনোলজি স্ট্যাক

| টেকনোলজি | ভার্সন | ব্যবহার |
|-----------|--------|----------|
| **Next.js** | 14.2.3 | Framework |
| **React** | 18.3.1 | UI Library |
| **Supabase** | 2.43.4 | Database + Auth |
| **Font Awesome** | 6.5.1 | Icons |
| **CSS3** | - | Styling |
| **Vercel** | - | Hosting |

---

## 📁 প্রোজেক্ট স্ট্রাকচার
belal-jamddar-enterprise/
├── app/
│   ├── layout.js                    # Root Layout (Meta, Fonts, CDN)
│   ├── globals.css                  # Global Styles (All CSS)
│   ├── page.js                      # Homepage (Products Grid + Search)
│   │
│   ├── product/
│   │   └── [id]/
│   │       └── page.js              # Product Details (Multiple Images, Payment)
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.js              # Admin Login
│   │   ├── dashboard/
│   │   │   └── page.js              # Admin Dashboard (Full Control)
│   │   ├── add-product/
│   │   │   └── page.js              # Add Product (Multiple Images)
│   │   ├── edit-product/
│   │   │   └── [id]/
│   │   │       └── page.js          # Edit Product
│   │   ├── users/
│   │   │   └── page.js              # User Management (Permissions)
│   │   └── settings/
│   │       └── page.js              # Store Settings
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js        # Login API
│   │   │   ├── logout/
│   │   │   │   └── route.js        # Logout API
│   │   │   └── check/
│   │   │       └── route.js        # Check Admin Status
│   │   └── products/
│   │       └── route.js             # Products API (CRUD)
│   │
│   └── sitemap.js                   # Dynamic Sitemap (SEO)
│
├── public/
│   ├── logo.png                     # Logo / Favicon
│   ├── favicon.ico                  # Favicon
│   ├── robots.txt                   # Robots.txt (Admin Hide)
│   └── site.webmanifest             # PWA Manifest
│
├── .env.local                       # Environment Variables
├── .gitignore                       # Git Ignore
├── package.json                     # Dependencies
├── package-lock.json                # Lock File
├── vercel.json                      # Vercel Deployment
└── README.md                        # Project Documentation
