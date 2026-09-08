// Auth Model (User Schema)
// - Belongs to: Member 1
// - Fields: name, email, password (hashed), role, isActive, createdAt
// - Roles enum: BUYER | SUPPLIER | ADMIN | SHIPPING_PARTNER
// - Pre-save hook: hash password with bcrypt before saving
// - Instance method: comparePassword(candidatePassword)
