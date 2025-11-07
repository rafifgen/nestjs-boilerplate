# Setup Checklist - Testimonials Admin Interface

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup Checklist

- [ ] PostgreSQL database is running
- [ ] `.env` file is configured with correct database credentials
- [ ] Node modules are installed (`npm install`)
- [ ] Application builds successfully (`npm run build`)

## ✅ Installation Steps

### Step 1: Run Database Migration

```bash
npm run migration:run
```

**Expected Result**:

- Migration `CreateTestimonial1730995200000` runs successfully
- New table `testimonial` is created in database

**Verify**: Check your database for the `testimonial` table

### Step 2: Seed Sample Data (Optional)

```bash
npm run seed:run:relational
```

**Expected Result**:

- 5 sample testimonials are inserted
- Seeds for roles, statuses, users, and testimonials run successfully

**Verify**: Run `SELECT COUNT(*) FROM testimonial;` in your database

### Step 3: Start the Application

```bash
npm run start:dev
```

**Expected Result**:

- Application starts without errors
- Listens on port 3000 (or your configured port)
- No compilation errors in console

## ✅ Testing Checklist

### Test 1: Access Admin List Page

- [ ] Navigate to `http://localhost:3000/admin/testimonials`
- [ ] Page loads successfully
- [ ] If seeded: 5 testimonials are visible in table
- [ ] Table shows: ID, Name, Position, Rating, Status, Actions
- [ ] "Add New Testimonial" button is visible

### Test 2: Create New Testimonial

- [ ] Click "Add New Testimonial" button
- [ ] Form loads at `/admin/testimonials/create`
- [ ] All fields are visible:
  - Name (text input)
  - Position (text input)
  - Content (textarea)
  - Avatar URL (text input)
  - Rating (dropdown, 1-5)
  - Active checkbox (checked by default)
- [ ] Fill in all required fields
- [ ] Click "Create Testimonial" button
- [ ] Redirects back to list page
- [ ] New testimonial appears in the table

### Test 3: Edit Existing Testimonial

- [ ] Click "Edit" link on any testimonial
- [ ] Form loads at `/admin/testimonials/{id}/edit`
- [ ] All fields are pre-filled with existing data
- [ ] Modify some fields
- [ ] Click "Edit Testimonial" button
- [ ] Redirects back to list page
- [ ] Changes are reflected in the table

### Test 4: Delete Testimonial

- [ ] Click "Delete" button on any testimonial
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Redirects back to list page
- [ ] Testimonial is removed from table

### Test 5: View on Frontend

- [ ] Navigate to `http://localhost:3000/web/home`
- [ ] Home page loads successfully
- [ ] Active testimonials are displayed
- [ ] Only testimonials with `isActive = true` are shown
- [ ] Testimonials show correct data (name, position, content, rating)

### Test 6: Theme Support

- [ ] Test with default theme
- [ ] Test with dark theme (if theme switching is implemented)
- [ ] Admin pages render correctly in both themes

## ✅ Validation Testing

### Test 7: Form Validation

- [ ] Try submitting create form with empty name → Should show error
- [ ] Try submitting create form with empty position → Should show error
- [ ] Try submitting create form with empty content → Should show error
- [ ] Try name with 101+ characters → Should show error
- [ ] Try position with 201+ characters → Should show error
- [ ] Try invalid URL in avatar field → Should show error
- [ ] Valid form submission succeeds

## ✅ Database Verification

### Check Database Tables

```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'testimonial';

-- Check all columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'testimonial';

-- View all testimonials
SELECT * FROM testimonial ORDER BY id;

-- Count active testimonials
SELECT COUNT(*) FROM testimonial WHERE "isActive" = true;
```

## ✅ Code Structure Verification

### Check Module Imports

- [ ] `TestimonialsModule` is imported in `app.module.ts`
- [ ] `AdminModule` is imported in `app.module.ts`
- [ ] `TestimonialsModule` is imported in `web.module.ts`
- [ ] `TestimonialSeedModule` is imported in `seed.module.ts`

### Check File Structure

```
src/
├── testimonials/
│   ├── domain/
│   │   └── testimonial.ts ✓
│   ├── dto/
│   │   ├── create-testimonial.dto.ts ✓
│   │   └── update-testimonial.dto.ts ✓
│   ├── infrastructure/
│   │   └── persistence/
│   │       ├── testimonial.repository.ts ✓
│   │       └── relational/
│   │           ├── entities/
│   │           │   └── testimonial.entity.ts ✓
│   │           ├── mappers/
│   │           │   └── testimonial.mapper.ts ✓
│   │           ├── repositories/
│   │           │   └── testimonial.repository.ts ✓
│   │           └── relational-persistence.module.ts ✓
│   ├── testimonials.module.ts ✓
│   └── testimonials.service.ts ✓
├── admin/
│   ├── admin.controller.ts ✓
│   └── admin.module.ts ✓
└── database/
    └── migrations/
        └── 1730995200000-CreateTestimonial.ts ✓
```

## ✅ Common Issues & Solutions

### Issue: Migration fails

**Solution**:

- Check database connection in `.env`
- Verify database is running
- Try: `npm run migration:revert` then `npm run migration:run`

### Issue: "Cannot find module" errors

**Solution**:

- Clear build cache: `rm -rf dist`
- Rebuild: `npm run build`
- Restart dev server: `npm run start:dev`

### Issue: 404 on admin routes

**Solution**:

- Verify `AdminModule` is imported in `app.module.ts`
- Check if server restarted after changes
- Check console for route registration logs

### Issue: Testimonials not showing on home page

**Solution**:

- Check if testimonials exist in database
- Check if testimonials have `isActive = true`
- Verify `TestimonialsService` is injected in `WebController`
- Check if `testimonials` variable is passed to template

### Issue: TypeScript compilation errors

**Solution**:

- Run: `npm run build` to see all errors
- Check import paths are correct
- Verify all entities are exported properly

## ✅ Production Readiness Checklist

Before deploying to production:

- [ ] Add authentication to admin routes
- [ ] Implement RBAC (Role-Based Access Control)
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Add rate limiting
- [ ] Implement proper error handling
- [ ] Add logging
- [ ] Create backup strategy
- [ ] Add monitoring
- [ ] Security audit
- [ ] Load testing
- [ ] Create admin user documentation

## ✅ Performance Checklist

- [ ] Database indexes are created (currently on `id` only)
- [ ] Pagination is working correctly
- [ ] No N+1 query issues
- [ ] Images/avatars are optimized
- [ ] Caching strategy (if needed)

## 📞 Support

If you encounter issues:

1. Check the documentation:
   - `TESTIMONIALS.md` - Full feature documentation
   - `QUICKSTART-TESTIMONIALS.md` - Quick setup guide
   - `SUMMARY-TESTIMONIALS.md` - Implementation summary

2. Check console logs for errors

3. Verify all environment variables are set

4. Ensure database is accessible

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
**Status**: Ready for testing
