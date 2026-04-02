# Finance Data Processing and Access Control Backend

## Core Requirements

- [x] User and Role Management
    - User creation and login handled using authController and authRoutes
    - Role assignment available through account creation
    - User Roles: VIEWER, ANALYST, ADMIN
    - User Status: Active or Inactive
    - Action Restriction based on role: provided through authorizeRoles in
      authMiddleware

- [] Financial Records Management

- [] Dashboard Summary APIs

- [] Access Control Logic

- [] Validation and Error Handling

- [] Data Persistence

## Additional Features (as mentioned in specsheet)

- [ ] Authentication using tokens or sessions
- [ ] Pagination for record listing
- [ ] Search support
- [ ] Soft delete functionality
- [ ] Rate limiting
- [ ] Unit tests or integration tests
- [ ] API documentation
