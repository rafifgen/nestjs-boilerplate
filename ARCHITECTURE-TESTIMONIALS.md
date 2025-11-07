# Testimonials Feature Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser / Client                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         NestJS Application                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AdminController                           │   │
│  │              (src/admin/admin.controller.ts)                 │   │
│  │                                                               │   │
│  │  Routes:                                                      │   │
│  │  • GET  /admin/testimonials            → List                │   │
│  │  • GET  /admin/testimonials/create     → Create Form         │   │
│  │  • POST /admin/testimonials            → Store               │   │
│  │  • GET  /admin/testimonials/:id/edit   → Edit Form           │   │
│  │  • POST /admin/testimonials/:id        → Update              │   │
│  │  • POST /admin/testimonials/:id/delete → Delete              │   │
│  └───────────────────────┬─────────────────────────────────────┘   │
│                          │                                           │
│                          │ uses                                      │
│                          ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              TestimonialsService                             │   │
│  │        (src/testimonials/testimonials.service.ts)            │   │
│  │                                                               │   │
│  │  Methods:                                                     │   │
│  │  • create(dto)                                                │   │
│  │  • findAllWithPagination(options)                            │   │
│  │  • findAllActive()                                            │   │
│  │  • findOne(id)                                                │   │
│  │  • update(id, dto)                                            │   │
│  │  • remove(id)                                                 │   │
│  └───────────────────────┬─────────────────────────────────────┘   │
│                          │                                           │
│                          │ uses                                      │
│                          ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │            TestimonialRepository (Abstract)                  │   │
│  │   (src/testimonials/infrastructure/persistence/              │   │
│  │                testimonial.repository.ts)                    │   │
│  └───────────────────────┬─────────────────────────────────────┘   │
│                          │                                           │
│                          │ implemented by                            │
│                          ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │       TestimonialsRelationalRepository                       │   │
│  │   (src/testimonials/infrastructure/persistence/relational/   │   │
│  │         repositories/testimonial.repository.ts)              │   │
│  │                                                               │   │
│  │  Uses TestimonialMapper to convert between:                  │   │
│  │  • Domain Model (Testimonial)                                │   │
│  │  • Entity Model (TestimonialEntity)                          │   │
│  └───────────────────────┬─────────────────────────────────────┘   │
│                          │                                           │
│                          │ uses TypeORM                              │
│                          ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              TestimonialEntity                               │   │
│  │   (src/testimonials/infrastructure/persistence/relational/   │   │
│  │              entities/testimonial.entity.ts)                 │   │
│  │                                                               │   │
│  │  Columns:                                                     │   │
│  │  • id: number (PK)                                            │   │
│  │  • name: string                                               │   │
│  │  • position: string                                           │   │
│  │  • content: text                                              │   │
│  │  • avatar: string (nullable)                                  │   │
│  │  • rating: number (1-5)                                       │   │
│  │  • isActive: boolean                                          │   │
│  │  • createdAt: Date                                            │   │
│  │  • updatedAt: Date                                            │   │
│  └───────────────────────┬─────────────────────────────────────┘   │
│                          │                                           │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
                           │ ORM
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                             │
│                                                                       │
│  Table: testimonial                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ id | name | position | content | avatar | rating | isActive  │  │
│  │    |      |          |         |        |        | createdAt │  │
│  │    |      |          |         |        |        | updatedAt │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## View Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      AdminController                                 │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ renders
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ViewService                                     │
│                 (src/view/view.service.ts)                           │
│                                                                       │
│  Uses Nunjucks template engine                                       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ loads templates
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Nunjucks Templates                                │
│                                                                       │
│  Default Theme:                                                      │
│  • views/pages/admin/testimonials-list.njk                          │
│  • views/pages/admin/testimonials-form.njk                          │
│                                                                       │
│  Dark Theme:                                                         │
│  • views/pages/admin/testimonials-list.njk                          │
│  • views/pages/admin/testimonials-form.njk                          │
│                                                                       │
│  Both extend: views/layouts/base.njk                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Module Dependency Graph

```
┌──────────────────┐
│   AppModule      │
└────────┬─────────┘
         │
         ├─────────────────────────┬──────────────────┐
         │                         │                  │
         ▼                         ▼                  ▼
┌──────────────────┐    ┌──────────────────┐  ┌─────────────┐
│  AdminModule     │    │  WebModule       │  │ ViewModule  │
└────────┬─────────┘    └────────┬─────────┘  └─────────────┘
         │                       │
         │                       │
         │    ┌──────────────────┘
         │    │
         ▼    ▼
┌──────────────────────────────┐
│   TestimonialsModule         │
│                              │
│  Exports:                    │
│  • TestimonialsService       │
│  • Persistence Module        │
└────────┬─────────────────────┘
         │
         │ contains
         ▼
┌───────────────────────────────────────┐
│ RelationalTestimonialPersistenceModule│
│                                        │
│  Provides:                             │
│  • TestimonialRepository               │
│  • TestimonialsRelationalRepository    │
│                                        │
│  Uses:                                 │
│  • TypeOrmModule.forFeature([          │
│      TestimonialEntity                 │
│    ])                                  │
└────────────────────────────────────────┘
```

## Data Flow

### Creating a Testimonial

```
User Form Submit
       │
       ▼
POST /admin/testimonials
       │
       ▼
AdminController.testimonialsStore()
       │
       │ validates CreateTestimonialDto
       ▼
TestimonialsService.create(dto)
       │
       ▼
TestimonialRepository.create(data)
       │
       ▼
TestimonialsRelationalRepository.create()
       │
       │ TestimonialMapper.toPersistence()
       ▼
TypeORM Repository.save()
       │
       ▼
PostgreSQL INSERT
       │
       ▼
Returns TestimonialEntity
       │
       │ TestimonialMapper.toDomain()
       ▼
Returns Testimonial (domain model)
       │
       ▼
Redirect to /admin/testimonials
```

### Displaying Testimonials on Home Page

```
GET /web/home
       │
       ▼
WebController.home()
       │
       ▼
TestimonialsService.findAllActive()
       │
       ▼
TestimonialRepository.findAllActive()
       │
       ▼
TypeORM Query: WHERE isActive = true
       │
       ▼
PostgreSQL SELECT
       │
       ▼
Returns TestimonialEntity[]
       │
       │ TestimonialMapper.toDomain()
       ▼
Returns Testimonial[]
       │
       ▼
ViewService.render('pages/home.njk', {
    testimonials: [...],
    ...
})
       │
       ▼
Nunjucks renders HTML with testimonials
       │
       ▼
HTML Response to Browser
```

## Database Seeding Flow

```
npm run seed:run:relational
       │
       ▼
SeedModule bootstraps
       │
       ▼
run-seed.ts executes in order:
       │
       ├─▶ RoleSeedService.run()
       ├─▶ StatusSeedService.run()
       ├─▶ UserSeedService.run()
       └─▶ TestimonialSeedService.run()
              │
              ▼
       Inserts 5 sample testimonials
       (if not already exist)
              │
              ▼
       Database populated
```

## File Organization

```
nestjs-boilerplate/
│
├── src/
│   ├── admin/                          # Admin interface
│   │   ├── admin.controller.ts         # CRUD routes
│   │   └── admin.module.ts             # Module config
│   │
│   ├── testimonials/                   # Testimonials feature
│   │   ├── domain/                     # Domain layer
│   │   │   └── testimonial.ts          # Domain model
│   │   │
│   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── create-testimonial.dto.ts
│   │   │   └── update-testimonial.dto.ts
│   │   │
│   │   ├── infrastructure/             # Infrastructure layer
│   │   │   └── persistence/
│   │   │       ├── testimonial.repository.ts     # Abstract repo
│   │   │       └── relational/
│   │   │           ├── entities/
│   │   │           │   └── testimonial.entity.ts # ORM entity
│   │   │           ├── mappers/
│   │   │           │   └── testimonial.mapper.ts # Mapper
│   │   │           ├── repositories/
│   │   │           │   └── testimonial.repository.ts  # Impl
│   │   │           └── relational-persistence.module.ts
│   │   │
│   │   ├── testimonials.module.ts      # Feature module
│   │   └── testimonials.service.ts     # Business logic
│   │
│   ├── view/                           # View templates
│   │   └── themes/
│   │       ├── default/
│   │       │   └── views/pages/admin/
│   │       │       ├── testimonials-list.njk
│   │       │       └── testimonials-form.njk
│   │       └── dark/
│   │           └── views/pages/admin/
│   │               ├── testimonials-list.njk
│   │               └── testimonials-form.njk
│   │
│   └── database/
│       ├── migrations/
│       │   └── 1730995200000-CreateTestimonial.ts
│       └── seeds/relational/testimonial/
│           ├── testimonial-seed.service.ts
│           └── testimonial-seed.module.ts
│
└── Documentation/
    ├── TESTIMONIALS.md                  # Full documentation
    ├── QUICKSTART-TESTIMONIALS.md       # Quick setup
    ├── SUMMARY-TESTIMONIALS.md          # Implementation summary
    ├── CHECKLIST-TESTIMONIALS.md        # Testing checklist
    └── ARCHITECTURE-TESTIMONIALS.md     # This file
```

## Key Design Patterns

### 1. Repository Pattern

- Abstract repository defines interface
- Concrete implementation handles data access
- Easy to switch between different databases

### 2. Domain-Driven Design

- Domain models are separate from entities
- Clear separation of concerns
- Business logic in service layer

### 3. DTO Pattern

- Input validation at controller level
- Type safety for data transfer
- class-validator decorators

### 4. Mapper Pattern

- Converts between domain and persistence models
- Keeps layers decoupled
- Single responsibility

### 5. Module Pattern (NestJS)

- Features organized as modules
- Dependency injection
- Clear module boundaries

## Security Considerations

```
┌─────────────────────────────────────┐
│  Future: Authentication Layer        │
│  (Not yet implemented)               │
│                                      │
│  Should protect:                     │
│  • All /admin/* routes               │
│  • Only admin role can access        │
│  • CSRF protection on forms          │
└─────────────────────────────────────┘
```

## Performance Considerations

- **Pagination**: List view uses pagination to limit rows
- **Eager Loading**: No relations yet, so no N+1 queries
- **Indexes**: Primary key index on `id`
- **Caching**: Not implemented (add if needed)

## Scalability

The architecture supports:

- ✅ Horizontal scaling (stateless controllers)
- ✅ Database replication (through TypeORM)
- ✅ Multiple database types (abstracted repository)
- ✅ Microservices (if needed, extract to separate service)

---

**Architecture Version**: 1.0
**Last Updated**: November 7, 2025
**Pattern**: Clean Architecture / Hexagonal Architecture
**Framework**: NestJS
**ORM**: TypeORM
**Database**: PostgreSQL
