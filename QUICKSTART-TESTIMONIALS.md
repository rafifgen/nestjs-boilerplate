# Quick Start Guide - Testimonials Admin Interface

## Setup Instructions

Follow these steps to set up and run the testimonials admin interface:

### 1. Run Database Migration

Create the testimonials table in your database:

```bash
npm run migration:run
```

### 2. Seed Sample Data (Optional)

Populate the database with sample testimonials:

```bash
npm run seed:run:relational
```

This will add 5 sample testimonials to your database.

### 3. Start the Application

```bash
npm run start:dev
```

### 4. Access the Admin Interface

Open your browser and navigate to:

**Admin Panel:** http://localhost:3000/admin/testimonials

**Home Page (with testimonials):** http://localhost:3000/web/home

## Admin Interface Features

### List View (`/admin/testimonials`)

- View all testimonials in a table format
- See ID, name, position, rating, and status
- Quick edit and delete actions
- Click "Add New Testimonial" to create a new entry

### Create Form (`/admin/testimonials/create`)

- **Name** (required): Author's full name
- **Position** (required): Job title or role
- **Content** (required): Testimonial text
- **Avatar URL** (optional): Link to profile image
- **Rating** (required): 1-5 stars, defaults to 5
- **Active** (checkbox): Whether to display on the website

### Edit Form (`/admin/testimonials/:id/edit`)

- Same fields as create form
- Pre-filled with existing data
- Click "Cancel" to return without saving

### Delete

- Click "Delete" button next to any testimonial
- Confirm the deletion in the popup dialog

## Using Testimonials on Your Pages

Testimonials are automatically available in templates through the `testimonials` variable.

Example usage in Nunjucks templates:

```njk
{% if testimonials.length > 0 %}
  <section class="testimonials">
    <h2>What Our Clients Say</h2>
    <div class="testimonials-grid">
      {% for testimonial in testimonials %}
        <div class="testimonial-card">
          {% if testimonial.avatar %}
            <img src="{{ testimonial.avatar }}" alt="{{ testimonial.name }}" class="avatar">
          {% endif %}
          <h3>{{ testimonial.name }}</h3>
          <p class="position">{{ testimonial.position }}</p>
          <p class="content">"{{ testimonial.content }}"</p>
          <div class="rating">
            {% for i in range(0, testimonial.rating) %}★{% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>
  </section>
{% endif %}
```

## Troubleshooting

### Migration Errors

If you encounter migration errors:

```bash
# Revert the last migration
npm run migration:revert

# Try running the migration again
npm run migration:run
```

### Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

### Database Connection Issues

Check your `.env` file has correct database credentials:

```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database
```

## API Usage (For Frontend Developers)

If you want to create a REST API, add these endpoints to `admin.controller.ts`:

```typescript
@Get('api/testimonials')
findAll() {
  return this.testimonialsService.findAllActive();
}

@Get('api/testimonials/:id')
findOne(@Param('id') id: string) {
  return this.testimonialsService.findOne(+id);
}
```

## Next Steps

1. **Add Authentication**: Protect admin routes with auth guards
2. **Customize Styling**: Update the Tailwind classes in the templates
3. **Add Image Upload**: Implement file upload for avatars
4. **Create API**: Add REST endpoints for frontend consumption
5. **Add Validation**: Enhance form validation and error handling

## Need Help?

- Check the main [TESTIMONIALS.md](./TESTIMONIALS.md) for detailed documentation
- Review the NestJS documentation: https://docs.nestjs.com/
- Check TypeORM documentation: https://typeorm.io/

Happy coding! 🚀
