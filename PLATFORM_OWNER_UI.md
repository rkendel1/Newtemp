# Platform Owner Feature - UI Overview

This document provides an overview of the Platform Owner user interface components.

## Dashboard Pages

### 1. Platform Owner Dashboard (`/dashboard/platform-owner`)

**Purpose:** Main landing page for Platform Owners showing key metrics and quick actions.

**Features:**
- **Statistics Cards:**
  - Total Creators (with active/trial breakdown)
  - Total Products (across all creators)
  - Total Subscribers (platform-wide)
  - Monthly Revenue (from platform subscriptions)

- **Quick Actions:**
  - Button to Manage SaaS Creators
  - Button to access Platform Settings

- **Platform Owner Badge:**
  - Visual indicator of Platform Owner access level

**Key Components Used:**
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Button
- Badge
- Icons: Users, Package, DollarSign, TrendingUp

---

### 2. Platform Settings (`/dashboard/platform-owner/settings`)

**Purpose:** Configure platform-wide subscription pricing and settings.

**Features:**
- **Subscription Price Configuration:**
  - Input field for price in cents
  - Real-time display of price in dollars
  - Currency selection

- **Billing Interval:**
  - Dropdown to select Monthly or Yearly

- **Trial Period:**
  - Input field for trial days
  - Default: 14 days

- **Form Actions:**
  - Save button with loading state
  - Back button to return to dashboard

**Key Components Used:**
- Card with form layout
- Input fields with labels
- Native select dropdown
- Button for saving
- ArrowLeft and Save icons

**Example Configuration:**
```
Subscription Price: 2900 cents ($29.00 USD)
Currency: USD
Billing Interval: Monthly
Trial Period: 14 days
```

---

### 3. Manage SaaS Creators (`/dashboard/platform-owner/creators`)

**Purpose:** View and manage all SaaS creators on the platform.

**Features:**
- **Filter Options:**
  - Dropdown to filter by status (All, Active, Trial, Canceled, Past Due)

- **Creators Table:**
  - Company name
  - Product URL (clickable external link)
  - Onboarding status (checkmark or X)
  - Stripe connection status (checkmark or X)
  - Subscription status (color-coded badge)
  - Created date
  - Action dropdown to update status

- **Status Management:**
  - Each creator has a dropdown to change status
  - Options: Active, Trial, Canceled, Past Due
  - Updates trigger API call and refresh

- **Visual Indicators:**
  - Green checkmark (✓) for completed items
  - Gray X for incomplete items
  - Color-coded badges for status:
    - Blue: Active
    - Gray: Trial
    - Red: Canceled
    - Outlined: Past Due

**Key Components Used:**
- Card with table layout
- Table with TableHeader, TableBody, TableRow, TableCell
- Badge with different variants
- Native select dropdown for actions
- Icons: CheckCircle2, XCircle, ExternalLink, ArrowLeft

**Example Table Row:**
```
Company: Example SaaS Inc
Product URL: [View →]
Onboarding: ✓
Stripe: ✓
Status: [Active]
Created: 1/15/2024
Actions: [Status Dropdown ▾]
```

---

## Navigation Structure

```
/dashboard/platform-owner
├── Main Dashboard
├── /settings
│   └── Platform Settings
└── /creators
    └── Manage SaaS Creators
```

---

## Access Control

All Platform Owner pages require authentication and the `platform_owner` role:

1. **Middleware Protection:**
   - `requirePlatformOwner` middleware checks user role
   - Returns 403 Forbidden if user is not a Platform Owner

2. **UI Protection:**
   - Pages can be accessed directly via URL
   - Backend enforces access control
   - Future enhancement: Add role-based navigation menu

---

## Color Scheme & Design

**Consistent with existing SaaS template:**
- Primary color: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Muted: Gray (#6b7280)

**Typography:**
- Headings: Bold, large font
- Descriptions: Muted foreground color
- Body text: Default theme color

**Spacing:**
- Consistent padding and margins
- Responsive grid layouts
- Card-based design pattern

---

## Responsive Design

All pages are responsive and work on:
- Desktop (default layout)
- Tablet (grid collapses to 2 columns)
- Mobile (single column layout)

Key breakpoints:
- `md:` - Medium screens (tablets)
- `lg:` - Large screens (desktops)

---

## Future UI Enhancements

1. **Charts and Graphs:**
   - Revenue trends over time
   - Creator growth chart
   - Subscriber metrics visualization

2. **Advanced Filtering:**
   - Multi-select filters
   - Date range pickers
   - Search functionality

3. **Bulk Actions:**
   - Select multiple creators
   - Batch status updates
   - Export to CSV

4. **Creator Details Modal:**
   - Click row to view full details
   - Edit creator information
   - View creator's products

5. **Notifications:**
   - Toast notifications for success/error
   - Real-time updates
   - Alert badges for pending actions

6. **Dark Mode:**
   - Already supported via ThemeProvider
   - All components styled for dark mode

---

## Integration Points

### Required API Endpoints:

1. **GET /api/platform/stats**
   - Returns dashboard statistics
   - Used by: Main dashboard page

2. **GET /api/platform/settings**
   - Returns current platform settings
   - Used by: Settings page initialization

3. **PATCH /api/platform/settings**
   - Updates platform settings
   - Used by: Settings page save action

4. **GET /api/platform/creators**
   - Returns list of creators (with filtering)
   - Used by: Creators management page

5. **PATCH /api/platform/creators/:id**
   - Updates creator status
   - Used by: Status dropdown in creators table

### State Management:

Currently using React hooks:
- `useState` for local state
- `useEffect` for data fetching
- Future: Consider React Query for data caching

---

## Testing Considerations

1. **Visual Testing:**
   - Verify all components render correctly
   - Check responsive layouts
   - Test dark mode compatibility

2. **Interaction Testing:**
   - Form submission works
   - Dropdowns update state
   - Navigation buttons work

3. **Data Testing:**
   - Mock data displays correctly
   - API integration works
   - Error states handled

4. **Accessibility:**
   - All interactive elements are keyboard accessible
   - Labels associated with inputs
   - ARIA attributes where needed

---

## Component Reusability

All components are built using the existing UI library:
- No new components created
- Consistent with existing patterns
- Easy to maintain and extend

**UI Components Used:**
- Card components (from `@/components/ui/card`)
- Button (from `@/components/ui/button`)
- Badge (from `@/components/ui/badge`)
- Table components (from `@/components/ui/table`)
- Input (from `@/components/ui/input`)
- Label (from `@/components/ui/label`)
- Icons (from `lucide-react`)
