---
name: Complete Admin/SuperAdmin Dashboard Frontend
overview: Build all admin/superadmin dashboard pages with functional forms and data management. Focus on structure, forms, and API integration - styling is secondary. Includes Sites, Partners, Structure pages, and supporting backend modules.
todos:
  - id: backend-sites
    content: Build Sites backend module (controller, service, DTOs, module) with full CRUD operations
    status: in_progress
  - id: backend-partners
    content: Build Partners backend module (controller, service, DTOs, module) with full CRUD operations
    status: completed
  - id: update-app-module
    content: Add SitesModule and PartnersModule to app.module.ts
    status: completed
    dependencies:
      - backend-sites
      - backend-partners
  - id: frontend-api-sites
    content: Create frontend API client for Sites (lib/api/sites.ts) with all CRUD methods
    status: completed
    dependencies:
      - backend-sites
  - id: frontend-api-partners
    content: Create frontend API client for Partners (lib/api/partners.ts) with all CRUD methods
    status: completed
    dependencies:
      - backend-partners
  - id: shared-data-table
    content: Create reusable DataTable component for displaying lists with actions
    status: completed
  - id: shared-form-dialog
    content: Create reusable FormDialog component for create/edit forms
    status: completed
  - id: shared-delete-dialog
    content: Create reusable DeleteDialog component for confirmation
    status: completed
  - id: shared-filter-bar
    content: Create reusable FilterBar component for filtering lists
    status: completed
  - id: sites-list-page
    content: Create Sites list page (/sites) with table, filters, and actions
    status: pending
    dependencies:
      - frontend-api-sites
      - shared-data-table
      - shared-filter-bar
  - id: sites-form
    content: Create Site form component with all fields and validation
    status: pending
    dependencies:
      - frontend-api-sites
      - shared-form-dialog
  - id: sites-crud
    content: Wire up Sites CRUD operations (create, edit, delete) with dialogs
    status: pending
    dependencies:
      - sites-list-page
      - sites-form
      - shared-delete-dialog
  - id: partners-list-page
    content: Create Partners list page (/partners) with table, filters, and actions
    status: pending
    dependencies:
      - frontend-api-partners
      - shared-data-table
      - shared-filter-bar
  - id: partners-form
    content: Create Partner form component with all fields and validation
    status: pending
    dependencies:
      - frontend-api-partners
      - shared-form-dialog
  - id: partners-crud
    content: Wire up Partners CRUD operations (create, edit, delete) with dialogs
    status: pending
    dependencies:
      - partners-list-page
      - partners-form
      - shared-delete-dialog
  - id: structure-page
    content: Create Structure overview page (/dashboard/structure) with stats and quick actions
    status: pending
    dependencies:
      - frontend-api-sites
      - frontend-api-partners
  - id: profile-page
    content: Create Profile page (/profile) with user info and edit form
    status: pending
  - id: settings-page
    content: Create Settings page (/settings) with basic skeleton structure
    status: pending
  - id: enhance-dashboard
    content: Enhance Dashboard overview with stats cards and quick links
    status: pending
    dependencies:
      - frontend-api-sites
      - frontend-api-partners
---

# Complete Admin/SuperAdmin Dashboard Frontend Plan

## AI Agent Workflow Instructions

**IMPORTANT: All AI agents working on this plan MUST follow these instructions exactly.**

### Step 1: Identify Your Task

1. Review the `todos` section in the frontmatter above
2. Find a TODO with `status: pending` that has all its dependencies completed
3. If a TODO has dependencies, check that all dependency TODOs have `status: completed` before starting
4. **Only work on ONE TODO per agent** - each agent should focus on a single atomic task

### Step 2: Create Your Branch

1. **Ensure you're on the `main` branch and it's up to date:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new branch with a descriptive name:**
   ```bash
   git checkout -b feature/<todo-id>
   ```


Example: If working on `shared-form-dialog`, use `feature/shared-form-dialog`

### Step 3: Implement Your Task

1. **Read the relevant section** in this plan file that describes your TODO
2. **Follow the specifications exactly** - implement all required features, files, and functionality
3. **Make logical, atomic commits** in chronological order:

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Each commit should represent a single logical change
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Use clear, descriptive commit messages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Example progression:
     ```
     feat: add FormDialog component structure
     feat: implement form validation in FormDialog
     feat: add error handling to FormDialog
     test: add FormDialog component tests (if applicable)
     ```


4. **Ensure your code:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Follows existing code patterns in the codebase
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Includes proper error handling
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Has appropriate TypeScript types
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Works with existing dependencies

### Step 4: Create GitHub Issue

1. **Use GitHub CLI to create an issue for your branch:**
   ```bash
   gh issue create \
     --title "Implement <TODO description>" \
     --body "This PR implements the <TODO ID> task from the plan.
   
   **Task:** <Full TODO content from plan>
   
   **Branch:** feature/<todo-id>
   
   **Related Plan:** complete_admin_superadmin_dashboard_frontend_d14cd2e5.plan.md
   
   **Dependencies:** <List any dependencies if applicable>
   
   **Changes:**
   - <List key changes made>
   " \
     --label "enhancement"
   ```

2. **Note the issue number** that gets created (e.g., #123)

### Step 5: Create Pull Request

1. **Push your branch to origin:**
   ```bash
   git push origin feature/<todo-id>
   ```

2. **Create a PR using GitHub CLI that closes the issue:**
   ```bash
   gh pr create \
     --title "feat: <Brief description of the feature>" \
     --body "This PR implements <TODO ID>: <TODO description>
   
   Closes #<issue-number>
   
   **What was implemented:**
   - <List main features/changes>
   
   **Files changed:**
   - <List key files created/modified>
   
   **Testing:**
   - <Describe how to test or what was tested>
   " \
     --base main \
     --head feature/<todo-id>
   ```

3. **Link the PR to close the issue** (the "Closes #<issue-number>" in the PR body will auto-close it when merged)

### Step 6: Update Plan Status (Optional)

If you have write access to update the plan file, mark your TODO as completed:

- Change `status: pending` to `status: completed` in the frontmatter

### Important Rules

- **One TODO per agent** - Do not work on multiple TODOs simultaneously
- **Respect dependencies** - Never start a TODO until all its dependencies are completed
- **Atomic commits** - Make small, logical commits rather than one large commit
- **Clear communication** - Use descriptive commit messages, issue titles, and PR descriptions
- **Follow existing patterns** - Match the code style and patterns already in the codebase
- **Test your work** - Ensure your implementation works before creating the PR

### Example Workflow

```bash
# 1. Checkout and update main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/shared-form-dialog

# 3. Make your changes and commit
# ... implement FormDialog component ...
git add frontend/components/ui/form-dialog.tsx
git commit -m "feat: add FormDialog component structure"

# ... add form validation ...
git add frontend/components/ui/form-dialog.tsx
git commit -m "feat: implement form validation in FormDialog"

# ... add error handling ...
git add frontend/components/ui/form-dialog.tsx
git commit -m "feat: add error handling to FormDialog"

# 4. Create issue
gh issue create --title "Implement shared-form-dialog component" --body "..."

# 5. Push and create PR
git push origin feature/shared-form-dialog
gh pr create --title "feat: add FormDialog component" --body "Closes #123 ..."
```

### Questions?

If you encounter any issues or have questions about:

- Dependencies not being met
- Unclear specifications
- Conflicts with existing code
- Technical implementation details

**Stop and ask for clarification** before proceeding. It's better to ask than to implement incorrectly.

---

# Complete Admin/SuperAdmin Dashboard Frontend Plan

## Overview

Build all admin/superadmin dashboard pages with functional forms and data management. Focus on structure, forms, and API integration. Styling is secondary - create skeleton pages that are fully functional.

## Current State

**Existing:**

- Auth system (login, register, me)
- Students module (backend + frontend API)
- Tutors module (backend + frontend API)
- Dashboard overview page (basic)
- Layout system (navbar, sidebar, breadcrumbs)

**Missing:**

- Sites module (backend + frontend)
- Partners module (backend + frontend)
- Structure page (frontend)
- Profile page (frontend)
- Settings page (frontend)

## Work Breakdown

### Phase 1: Backend Modules (Foundation)

#### 1.1 Sites Module Backend

**Files to create:**

- `backend/src/sites/sites.module.ts`
- `backend/src/sites/sites.controller.ts`
- `backend/src/sites/sites.service.ts`
- `backend/src/sites/dto/create-site.dto.ts`
- `backend/src/sites/dto/update-site.dto.ts`
- `backend/src/sites/dto/site-response.dto.ts`
- `backend/src/sites/dto/search-sites-query.dto.ts`

**Endpoints:**

- `POST /sites` - Create site (Admin/SuperAdmin only)
- `GET /sites` - List all sites (with filters: active, city, state)
- `GET /sites/:id` - Get site by ID
- `PUT /sites/:id` - Update site (Admin/SuperAdmin only)
- `DELETE /sites/:id` - Delete site (Admin/SuperAdmin only, with validation)

**Form fields (CreateSiteDto):**

- name (required, string, max 255)
- address (optional, text)
- city (optional, string, max 100)
- state (optional, string, max 50)
- zipCode (optional, string, max 20)
- phone (optional, string, max 20)
- email (optional, email)
- active (boolean, default true)

**Business rules:**

- Hard delete with RESTRICT on students/sessions (prevent deletion if has students/sessions)
- All authenticated users can view sites
- Only Admin/SuperAdmin can create/update/delete

#### 1.2 Partners Module Backend

**Files to create:**

- `backend/src/partners/partners.module.ts`
- `backend/src/partners/partners.controller.ts`
- `backend/src/partners/partners.service.ts`
- `backend/src/partners/dto/create-partner.dto.ts`
- `backend/src/partners/dto/update-partner.dto.ts`
- `backend/src/partners/dto/partner-response.dto.ts`
- `backend/src/partners/dto/search-partners-query.dto.ts`

**Endpoints:**

- `POST /partners` - Create partner (Admin/SuperAdmin only)
- `GET /partners` - List all partners (with filters: active, type)
- `GET /partners/:id` - Get partner by ID
- `PUT /partners/:id` - Update partner (Admin/SuperAdmin only)
- `DELETE /partners/:id` - Delete partner (Admin/SuperAdmin only)

**Form fields (CreatePartnerDto):**

- name (required, string, max 255)
- type (optional, enum: 'School' | 'Co' | 'Organization' | 'Other')
- contactName (optional, string, max 255)
- contactEmail (optional, email)
- contactPhone (optional, string, max 20)
- address (optional, text)
- active (boolean, default true)

**Business rules:**

- Hard delete with CASCADE on partnerships
- All authenticated users can view partners
- Only Admin/SuperAdmin can create/update/delete

#### 1.3 Update App Module

- Add SitesModule and PartnersModule to `app.module.ts`

### Phase 2: Frontend API Clients

#### 2.1 Sites API Client

**File:** `frontend/lib/api/sites.ts`

**Interfaces:**

```typescript
interface Site {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateSiteDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

interface UpdateSiteDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

interface SearchSitesQuery {
  active?: boolean;
  city?: string;
  state?: string;
}
```

**API methods:**

- `getAll(query?: SearchSitesQuery)`
- `getById(id: string)`
- `create(data: CreateSiteDto)`
- `update(id: string, data: UpdateSiteDto)`
- `delete(id: string)`

#### 2.2 Partners API Client

**File:** `frontend/lib/api/partners.ts`

**Interfaces:**

```typescript
interface Partner {
  id: string;
  name: string;
  type?: 'School' | 'Co' | 'Organization' | 'Other';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePartnerDto {
  name: string;
  type?: 'School' | 'Co' | 'Organization' | 'Other';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active?: boolean;
}

interface UpdatePartnerDto {
  name?: string;
  type?: 'School' | 'Co' | 'Organization' | 'Other';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active?: boolean;
}

interface SearchPartnersQuery {
  active?: boolean;
  type?: 'School' | 'Co' | 'Organization' | 'Other';
}
```

**API methods:**

- `getAll(query?: SearchPartnersQuery)`
- `getById(id: string)`
- `create(data: CreatePartnerDto)`
- `update(id: string, data: UpdatePartnerDto)`
- `delete(id: string)`

### Phase 3: Shared Components

#### 3.1 Data Table Component

**File:** `frontend/components/ui/data-table.tsx`

**Features:**

- Display list of items (sites, partners, students, tutors)
- Column headers with sorting (optional)
- Row actions (view, edit, delete)
- Empty state
- Loading state
- Basic styling (skeleton)

**Props:**

- `data: T[]`
- `columns: ColumnDef<T>[]`
- `onEdit?: (item: T) => void`
- `onDelete?: (item: T) => void`
- `isLoading?: boolean`

#### 3.2 Form Dialog Component

**File:** `frontend/components/ui/form-dialog.tsx`

**Features:**

- Modal dialog for create/edit forms
- Form validation with react-hook-form
- Submit/cancel buttons
- Error display

**Props:**

- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `title: string`
- `defaultValues?: T`
- `onSubmit: (data: T) => Promise<void>`
- `children: ReactNode` (form fields)

#### 3.3 Delete Confirmation Dialog

**File:** `frontend/components/ui/delete-dialog.tsx`

**Features:**

- Confirmation dialog for delete actions
- Item name display
- Warning message
- Confirm/cancel buttons

**Props:**

- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `itemName: string`
- `onConfirm: () => Promise<void>`

#### 3.4 Filter Bar Component

**File:** `frontend/components/ui/filter-bar.tsx`

**Features:**

- Filter inputs (active status, search, etc.)
- Apply/clear filters
- Basic styling

**Props:**

- `filters: FilterConfig[]`
- `onFilterChange: (filters: Record<string, any>) => void`
- `onClear: () => void`

### Phase 4: Sites Pages

#### 4.1 Sites List Page

**File:** `frontend/app/sites/page.tsx`

**Features:**

- Page header with "Sites" title and "Add Site" button
- Data table showing all sites
- Filter bar (active status, city, state)
- Row actions: View, Edit, Delete
- Empty state when no sites
- Loading state

**Data fetching:**

- Use `sitesApi.getAll()` with filters
- Use React Query for caching

**Actions:**

- Click "Add Site" → Open create form dialog
- Click "Edit" → Open edit form dialog
- Click "Delete" → Open delete confirmation dialog

#### 4.2 Site Form Component

**File:** `frontend/components/sites/site-form.tsx`

**Form fields (using react-hook-form):**

- Name (required, text input)
- Address (optional, textarea)
- City (optional, text input)
- State (optional, text input)
- Zip Code (optional, text input)
- Phone (optional, text input with validation)
- Email (optional, email input with validation)
- Active (checkbox, default true)

**Validation:**

- Name: required, max 255 chars
- Email: valid email format if provided
- Phone: basic format validation if provided

**Usage:**

- Used in create dialog
- Used in edit dialog (with defaultValues)

#### 4.3 Site Detail Page (Optional)

**File:** `frontend/app/sites/[id]/page.tsx`

**Features:**

- Display site details
- Edit button (opens form dialog)
- Delete button
- Related data (students count, sessions count - if backend provides)

### Phase 5: Partners Pages

#### 5.1 Partners List Page

**File:** `frontend/app/partners/page.tsx`

**Features:**

- Page header with "Partners" title and "Add Partner" button
- Data table showing all partners
- Filter bar (active status, type)
- Row actions: View, Edit, Delete
- Empty state when no partners
- Loading state

**Data fetching:**

- Use `partnersApi.getAll()` with filters
- Use React Query for caching

**Actions:**

- Click "Add Partner" → Open create form dialog
- Click "Edit" → Open edit form dialog
- Click "Delete" → Open delete confirmation dialog

#### 5.2 Partner Form Component

**File:** `frontend/components/partners/partner-form.tsx`

**Form fields (using react-hook-form):**

- Name (required, text input)
- Type (optional, select: School, Co, Organization, Other)
- Contact Name (optional, text input)
- Contact Email (optional, email input)
- Contact Phone (optional, text input)
- Address (optional, textarea)
- Active (checkbox, default true)

**Validation:**

- Name: required, max 255 chars
- Contact Email: valid email format if provided
- Contact Phone: basic format validation if provided

**Usage:**

- Used in create dialog
- Used in edit dialog (with defaultValues)

#### 5.3 Partner Detail Page (Optional)

**File:** `frontend/app/partners/[id]/page.tsx`

**Features:**

- Display partner details
- Edit button (opens form dialog)
- Delete button
- Related data (partnerships count - if backend provides)

### Phase 6: Structure Page

#### 6.1 Structure Overview Page

**File:** `frontend/app/dashboard/structure/page.tsx`

**Features:**

- Overview of organizational structure
- Cards/sections showing:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Sites (with link to sites page)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Partners (with link to partners page)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Students (with link to students page - if exists)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Tutors (with link to tutors page - if exists)
- Quick actions:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Add Site
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Add Partner
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Add Student (if exists)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Add Tutor (if exists)

**Data fetching:**

- Fetch counts from APIs
- Use React Query for caching

**Layout:**

- Grid of stat cards
- Action buttons section

### Phase 7: Profile & Settings Pages

#### 7.1 Profile Page

**File:** `frontend/app/profile/page.tsx`

**Features:**

- Display current user information
- Edit form for:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - First Name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Last Name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Email (read-only or editable?)
- Save button
- Change password section (if needed)

**Form fields:**

- First Name (text input)
- Last Name (text input)
- Email (text input, possibly read-only)

**API:**

- Use `authApi.getMe()` to get current user
- Create `authApi.updateProfile()` if backend supports it

#### 7.2 Settings Page

**File:** `frontend/app/settings/page.tsx`

**Features:**

- User preferences (if any)
- Account settings
- Notification preferences (if any)
- Basic skeleton for future settings

**Form fields:**

- Placeholder for future settings
- Basic structure only

### Phase 8: Enhanced Dashboard Overview

#### 8.1 Dashboard Overview Page

**File:** `frontend/app/dashboard/dashboard-content.tsx` (update existing)

**Enhancements:**

- Add stat cards:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Sites
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Partners
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Students
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total Tutors
- Add quick links to main pages
- Add recent activity section (if backend provides)
- Role-based content (different for admin vs tutor)

**Data fetching:**

- Fetch counts from multiple APIs
- Use React Query for parallel fetching

## Implementation Order (For Speed)

1. **Backend Sites Module** (1-2 hours)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create all DTOs, service, controller, module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Test with Swagger/Postman

2. **Backend Partners Module** (1-2 hours)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create all DTOs, service, controller, module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Test with Swagger/Postman

3. **Frontend API Clients** (30 min)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create sites.ts and partners.ts API clients

4. **Shared Components** (1-2 hours)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Data table component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Form dialog component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Delete dialog component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Filter bar component

5. **Sites Pages** (2-3 hours)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Sites list page
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Site form component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Wire up all CRUD operations

6. **Partners Pages** (2-3 hours)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Partners list page
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Partner form component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Wire up all CRUD operations

7. **Structure Page** (1 hour)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create overview page with stats and quick actions

8. **Profile & Settings** (1 hour)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Basic profile page
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Basic settings page skeleton

9. **Enhanced Dashboard** (1 hour)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update dashboard with stats and quick links

**Total Estimated Time: 10-15 hours**

## Technical Details

### Form Validation

- Use `react-hook-form` with `zod` for validation
- Follow existing patterns from login/register pages
- Show validation errors inline

### Error Handling

- Use toast notifications for success/error messages
- Handle API errors gracefully
- Show loading states during operations

### State Management

- Use React Query for all data fetching
- Cache API responses
- Invalidate cache on mutations

### Routing

- Use Next.js App Router
- Protect routes with role-based checks
- Use server-side redirects where appropriate

### Styling Approach

- Use existing UI components (Card, Button, Input, etc.)
- Minimal custom styling - focus on functionality
- Use existing design tokens where possible
- Skeleton/placeholder styling is acceptable

## Success Criteria

- [ ] All admin/superadmin pages are accessible
- [ ] All forms are functional with validation
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Data tables display data correctly
- [ ] Filters work correctly
- [ ] Error handling is in place
- [ ] Loading states are shown
- [ ] Navigation works correctly
- [ ] Role-based access control works

## Notes

- Focus on functionality over styling
- Reuse components where possible
- Follow existing code patterns
- Test each page as it's built
- Keep forms simple but complete
- Error messages should be user-friendly