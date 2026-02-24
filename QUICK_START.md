# Quick Start Guide - CloudPos Restaurant POS

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd restaurant-pos
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to [http://localhost:3000/login](http://localhost:3000/login)

## 🔐 Test Login

Use these credentials to test different roles:

### Admin Access (Full Access)
- **Name**: Richardo Wilson
- **PIN**: `123456`

### Manager Access
- **Name**: Michael Chen
- **PIN**: `345678`

### Cashier Access
- **Name**: Daniel Martinez
- **PIN**: `567890`

## 🎯 Quick Tour

### 1. Login Page (`/login`)
- Select employee from dropdown
- Enter 6-digit PIN using on-screen numpad
- Click "Start Shift"

### 2. Dashboard (`/`)
- View today's earnings and order statistics
- See in-progress and waiting-for-payment orders
- Quick navigation to all features

### 3. Create Order (`/order/create`)
- Browse menu items by category
- Add items to cart
- Enter customer name
- Select table (for dine-in) or choose take-away
- Place order

### 4. Process Payment (`/order/[id]/payment`)
- Select payment method (Cash, QRIS, Debit, Transfer)
- For cash: enter amount received, see change calculated
- Confirm payment

### 5. Table Management (`/table`)
- View all tables by section
- See table status (Available, Occupied, Reserved, Cleaning)
- Quick access to active orders

### 6. Kitchen Display (`/kitchen`)
- View orders by status (New, Cooking, Ready)
- See time elapsed for each order
- Mark items as complete

## 📊 Sample Data

The system comes pre-loaded with:
- **8 employees** across different roles
- **6 active orders** in various states
- **20 menu items** (Food, Beverage, Additional)
- **12 tables** in 2 sections
- **5 active discounts**
- **5 reservations**
- **30 transaction records**

## 🎨 Key Features to Test

### Order Flow
1. Login as cashier
2. Go to "Create New Order"
3. Add menu items
4. Enter customer details
5. Place order
6. View order in "Order" page
7. Process payment

### Table Management
1. View table layout
2. See occupied tables with active orders
3. Click on occupied table to see order details

### Kitchen Operations
1. Login as kitchen staff
2. View kitchen display
3. See orders organized by status
4. Monitor time elapsed

### Shift Management
1. Login as cashier
2. Go to "Shift" page
3. View current shift statistics
4. Close shift with cash count

## 🔧 Customization

### Update Restaurant Info
Edit `lib/mock-data.ts` to customize:
- Menu items and prices
- Table layout
- Employee list
- Categories

### Modify Tax Rates
Edit `lib/constants.ts`:
```typescript
export const TAX_RATE = 0.11 // 11% PPN
export const SERVICE_CHARGE_RATE = 0.05 // 5%
```

### Change Color Scheme
Edit `lib/constants.ts`:
```typescript
export const COLORS = {
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#F97316',
  danger: '#EF4444',
  purple: '#8B5CF6',
}
```

## 📱 Responsive Testing

The app is optimized for:
- **Desktop**: 1920px and above
- **Tablet Landscape**: 1024px (primary target)
- **Tablet Portrait**: 768px
- **Mobile**: 640px and below

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 💡 Tips

1. **Use keyboard shortcuts**: Tab to navigate, Enter to submit
2. **Test different roles**: Each role has different menu access
3. **Check responsive design**: Resize browser to see mobile layout
4. **Explore mock data**: All data is in `lib/mock-data.ts`
5. **Customize freely**: No backend means safe to experiment

## 🎓 Next Steps

1. Explore all 16+ pages
2. Test order creation and payment flow
3. Try different user roles
4. Customize menu items and prices
5. Modify the design to match your brand

---

Need help? Check the main README.md for detailed documentation.
