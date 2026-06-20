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