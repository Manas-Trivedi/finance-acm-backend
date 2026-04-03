# Finance Data Processing and Access Control Backend

## Core Requirements

- [x] User and Role Management
    - User creation and login handled using authController and authRoutes
    - Role assignment available through account creation for VIEWER and ANALYST
    - User Roles: VIEWER, ANALYST, ADMIN
    - User Status: Active or Inactive
    - Action Restriction based on role: provided through authorizeRoles in
      authMiddleware

- [x] Financial Records Management
    - Record creation, viewing, updating, and deletion handled using
      recordController and recordRoutes
    - Record fields stored: amount, type, category, date, and notes
    - Record Types: INCOME, EXPENSE
    - Filtering available on record listing using type, category, amount range,
      and date range
    - Deleted records are soft deleted using isDeleted

- [ ] Dashboard Summary APIs


- [x] Access Control Logic
    - JWT based authentication provided through authenticate middleware
    - Role based access control provided through authorizeRoles middleware
    - Record creation, update, and delete routes are restricted to ADMIN
    - Record viewing requires a valid authenticated user

- [x] Validation and Error Handling
    - Required field checks added for auth and record routes
    - Input validation added for email and password presence, password length,
      amount, type, date, and record id
    - Invalid credentials, invalid token, forbidden access, and missing records
      return proper error responses
    - Status codes such as 200, 201, 400, 401, 403, 404, 409, and 500 are used

- [x] Data Persistence
    - Data is stored using Prisma with SQLite
    - User and FinancialRecord models are defined in schema.prisma
    - Enums are used for roles, user status, and record type

## Additional Features (as mentioned in specsheet)

- [x] Authentication using tokens or sessions
- [x] Pagination for record listing
- [ ] Search support
- [x] Soft delete functionality
- [ ] Rate limiting
- [ ] Unit tests or integration tests
- [ ] API documentation

## API Overview

- `POST /auth/register`
    - Register a new user
- `POST /auth/login`
    - Login and get JWT token
- `GET /records`
    - View records with optional filters and pagination
- `POST /records`
    - Create a new record
- `PATCH /records/:id`
    - Update an existing record
- `DELETE /records/:id`
    - Soft delete a record
