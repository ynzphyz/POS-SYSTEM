# CloudPos - Restaurant POS System

A complete, professional Restaurant Point of Sale (POS) system built with Next.js 14, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Completed Pages (16 Pages)

1. **Login / Shift Start** (`/login`)
   - Employee selection with shift times
   - 6-digit PIN authentication
   - Clean, centered layout

2. **Dashboard** (`/`)
   - Summary cards: Total Earning, In Progress, Ready to Served, Waiting for Payment
   - Quick stats: Total orders, Average order value
   - In Progress and Waiting for Payment order lists
   - Role-based navigation

3. **Order Management** (`/order`)
   - Search by Order ID or Customer Name
   - Filter tabs: All, In Progress, Ready to Served, Waiting for Payment
   - Order cards with progress indicators
   - Quick actions: See Details, Pay Bills

4. **Create New Order** (`/order/create`)
   - Menu grid with category filters (All, Food, Beverage, Additional)
   - Search menu items
   - Real-time order summary
   - Customer name and table selection
   - Order type: Dine In / Take Away
   - Automatic tax and service charge calculation
   - Discount support

5. **Order Detail** (`/order/[id]`)
   - Full order information
   - Item list with status indicators
   - Order summary with pricing breakdown
   - Action buttons: Pay Bills, Print Bill, Edit, Cancel

6. **Payment / Cashier** (`/order/[id]/payment`)
   - Multiple payment methods: Cash, QRIS, Debit Card, Bank Transfer
   - Cash: automatic change calculation
   - QRIS: QR code placeholder
   - Debit/Transfer: reference number input
   - Order summary with total breakdown

7. **Table Management** (`/table`)
   - Visual floor plan layout
   - Tables grouped by sections (A, B)
   - Status indicators: Available, Occupied, Reserved, Cleaning
   - Active order information on occupied tables
   - Quick actions for occupied tables

8. **Reservation** (`/reservation`)
   - Reservation cards with customer details
   - Date, time, party size, table assignment
   - Status badges: Confirmed, Pending, Cancelled, Completed
   - Notes support

9. **Kitchen Display** (`/kitchen`)
   - Large card layout optimized for kitchen
   - Orders grouped: New Order, Cooking, Ready to Serve
   - Time elapsed indicators with color urgency
   - Item checklist per order
   - Real-time clock display

10. **Transaction History** (`/history`)
    - Comprehensive transaction table
    - Search and filter capabilities
    - Summary cards: Total transactions, Total revenue
    - Export CSV placeholder
    - Payment method and status indicators

11. **Shift Management** (`/shift`)
    - Open/Close shift functionality
    - Current shift status with live stats
    - Opening and closing cash management
    - Cash difference calculation
    - Shift history table

12. **Reservations** (`/reservation`)
    - Reservation list with customer details
    - Status management
    - Party size and table assignment
    - Notes and special requests

13. **Inventory** (`/inventory`)
    - Placeholder for menu and stock management

14. **Reports** (`/reports`)
    - Placeholder for analytics and reports

15. **Discounts & Promos** (`/discount`)
    - Active discount list
    - Promo details: type, value, validity period
    - Usage tracking
    - Status management

16. **User Management** (`/users`)
    - Admin-only access
    - Employee list with roles
    - Status indicators
    - Edit and Reset PIN actions

17. **Settings** (`/settings`)
    - Restaurant profile
    - Tax and service charge configuration
    - Receipt settings

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (custom implementation)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Data**: Mock data (no backend)

## 📦 Installation

```bash
# Navigate to project directory
cd restaurant-pos

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Login Credentials

Use any employee from the mock data with their PIN:

- **Richardo Wilson** (Admin) - PIN: `123456`
- **Sarah Johnson** (Admin) - PIN: `234567`
- **Michael Chen** (Manager) - PIN: `345678`
- **Emily Davis** (Manager) - PIN: `456789`
- **Daniel Martinez** (Cashier) - PIN: `567890`
- **Alexandra Brown** (Cashier) - PIN: `678901`
- **James Wilson** (Cashier) - PIN: `789012`
- **Lisa Anderson** (Kitchen) - PIN: `890123`

## 🎨 Design System

### Color Palette
- Primary Blue: `#3B82F6`
- Success Green: `#22C55E`
- Warning Orange: `#F97316`
- Danger Red: `#EF4444`
- Purple Accent: `#8B5CF6`
- Background: `#F8FAFC`
- Card: `#FFFFFF`

### UI Components
- Soft shadows and rounded corners (rounded-xl)
- Consistent card design throughout
- Status badges with color coding
- Smooth transitions and hover states
- Responsive design (optimized for tablet 1024px)

## 📁 Project Structure

```
restaurant-pos/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── order/
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   └── payment/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── table/
│   │   └── page.tsx
│   ├── reservation/
│   │   └── page.tsx
│   ├── kitchen/
│   │   └── page.tsx
│   ├── history/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   ├── inventory/
│   │   └── page.tsx
│   ├── shift/
│   │   └── page.tsx
│   ├── discount/
│   │   └── page.tsx
│   ├── users/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/
│   │   └── navbar.tsx
│   └── shared/
│       ├── status-badge.tsx
│       └── empty-state.tsx
├── lib/
│   ├── types.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── mock-data.ts
└── package.json
```

## 🔑 Key Features

### Role-Based Access Control
- **Admin**: Full access to all pages
- **Manager**: Access to operations, reports, and discounts
- **Cashier**: Access to orders, tables, kitchen, and shift management
- **Waiter**: Access to orders, tables, and kitchen
- **Kitchen**: Access to kitchen display only

### Mock Data Includes
- 8 employees with varied roles
- 6 orders with different statuses
- 20 menu items across 3 categories
- 12 tables in 2 sections
- 5 active discounts/promos
- 5 reservations
- 2 shifts (1 open, 1 closed)
- 30 transaction records

### Responsive Design
- Optimized for tablet landscape (1024px primary)
- Responsive down to 768px
- Mobile-friendly navigation
- Touch-optimized controls

## 🚧 Future Enhancements

- Backend API integration
- Real authentication system
- Database integration
- Receipt printing
- Real-time order updates (WebSocket)
- Advanced reporting with charts
- Inventory management with low stock alerts
- Multi-location support
- Customer loyalty program
- Online ordering integration

## 📝 Notes

- All data is stored in mock files (`lib/mock-data.ts`)
- Authentication uses localStorage (not production-ready)
- No actual payment processing
- All forms have basic validation
- Designed for production-quality UI

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using Next.js 14, Tailwind CSS, and shadcn/ui
# POS-SYSTEM
# POS-SYSTEM
