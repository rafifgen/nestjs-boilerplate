# Testimonials Module

This module provides a complete CRUD (Create, Read, Update, Delete) interface for managing testimonials with an admin panel.

## Features

- ✅ Database-backed testimonials storage
- ✅ Admin interface for CRUD operations
- ✅ Support for both light and dark themes
- ✅ Rating system (1-5 stars)
- ✅ Active/Inactive status toggle
- ✅ Avatar image support
- ✅ Responsive design with Tailwind CSS

## Database Schema

The testimonials table includes:

- `id` - Auto-incrementing primary key
- `name` - Testimonial author name (required)
- `position` - Author's position/title (required)
- `content` - Testimonial text content (required)
- `avatar` - URL to avatar image (optional)
- `rating` - Star rating from 1-5 (default: 5)
- `isActive` - Boolean flag to show/hide testimonial (default: true)
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

## Admin Interface

### Accessing the Admin Panel

Navigate to: `http://localhost:3000/admin/testimonials`

### Available Routes

1. **List Testimonials**: `GET /admin/testimonials`
   - View all testimonials in a paginated table
   - See status (Active/Inactive), rating, and basic info
   - Quick access to edit/delete actions

2. **Create Testimonial**: `GET /admin/testimonials/create`
   - Form to add a new testimonial
   - All fields validated

3. **Save New Testimonial**: `POST /admin/testimonials`
   - Processes the create form submission

4. **Edit Testimonial**: `GET /admin/testimonials/:id/edit`
   - Form to edit existing testimonial
   - Pre-populated with current data

5. **Update Testimonial**: `POST /admin/testimonials/:id`
   - Processes the edit form submission

6. **Delete Testimonial**: `POST /admin/testimonials/:id/delete`
   - Removes a testimonial (with confirmation)

## Frontend Integration

Testimonials are automatically available in the home page template. Access them in your views:

```njk
{% if testimonials.length > 0 %}
  <section id="testimonials">
    {% for testimonial in testimonials %}
      <div class="testimonial-card">
        {% if testimonial.avatar %}
          <img src="{{ testimonial.avatar }}" alt="{{ testimonial.name }}">
        {% endif %}
        <h3>{{ testimonial.name }}</h3>
        <p class="position">{{ testimonial.position }}</p>
        <p class="content">{{ testimonial.content }}</p>
        <div class="rating">
          {% for i in range(0, testimonial.rating) %}★{% endfor %}
        </div>
      </div>
    {% endfor %}
  </section>
{% endif %}
```

## API Usage (Optional)

If you want to create a REST API for testimonials, you can extend the `TestimonialsService` with additional endpoints.

### Service Methods Available:

- `create(dto)` - Create a new testimonial
- `findAllWithPagination(options)` - Get paginated testimonials
- `findAllActive()` - Get only active testimonials
- `findOne(id)` - Get a single testimonial by ID
- `update(id, dto)` - Update a testimonial
- `remove(id)` - Delete a testimonial

## Migration

Run the database migration to create the testimonials table:

```bash
npm run migration:run
```

The migration file is located at:
`src/database/migrations/1730995200000-CreateTestimonial.ts`

## Project Structure

```
src/
├── testimonials/
│   ├── domain/
│   │   └── testimonial.ts                      # Domain model
│   ├── dto/
│   │   ├── create-testimonial.dto.ts           # Create DTO
│   │   └── update-testimonial.dto.ts           # Update DTO
│   ├── infrastructure/
│   │   └── persistence/
│   │       ├── testimonial.repository.ts       # Abstract repository
│   │       └── relational/
│   │           ├── entities/
│   │           │   └── testimonial.entity.ts   # TypeORM entity
│   │           ├── mappers/
│   │           │   └── testimonial.mapper.ts   # Domain/Entity mapper
│   │           ├── repositories/
│   │           │   └── testimonial.repository.ts # Repository implementation
│   │           └── relational-persistence.module.ts
│   ├── testimonials.module.ts                  # Module definition
│   └── testimonials.service.ts                 # Business logic
├── admin/
│   ├── admin.controller.ts                     # Admin routes
│   └── admin.module.ts                         # Admin module
└── view/
    └── themes/
        ├── default/
        │   └── views/
        │       └── pages/
        │           └── admin/
        │               ├── testimonials-list.njk   # List view
        │               └── testimonials-form.njk   # Create/Edit form
        └── dark/
            └── views/
                └── pages/
                    └── admin/
                        ├── testimonials-list.njk
                        └── testimonials-form.njk
```

## Theming

The admin interface automatically adapts to the current theme (light/dark). Both themes have dedicated templates with appropriate styling.

## Validation

All form inputs are validated:

- **Name**: Required, max 100 characters
- **Position**: Required, max 200 characters
- **Content**: Required, text field
- **Avatar**: Optional, must be valid URL
- **Rating**: Required, integer between 1-5
- **IsActive**: Optional boolean, defaults to true

## Security Notes

⚠️ **Important**: The current implementation does not include authentication. Before deploying to production, you should:

1. Add authentication middleware to admin routes
2. Implement role-based access control (RBAC)
3. Add CSRF protection for forms
4. Sanitize user inputs to prevent XSS attacks

Example authentication guard:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt')) // Add authentication
export class AdminController {
  // ... routes
}
```

## Future Enhancements

Potential improvements:

- [ ] Add image upload functionality for avatars
- [ ] Implement search and filtering in admin panel
- [ ] Add bulk actions (delete multiple, toggle status)
- [ ] Create a public API with Swagger documentation
- [ ] Add testimonial moderation workflow
- [ ] Implement sorting (by date, rating, etc.)
- [ ] Add export functionality (CSV, PDF)

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.
