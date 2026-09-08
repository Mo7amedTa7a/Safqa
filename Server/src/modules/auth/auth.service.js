// Auth Service
// - Belongs to: Member 1
// - register(userData): create new user, hash password, return user + token
// - login(email, password): find user, compare password, generate JWT
// - logout(): client-side token removal (stateless JWT)
// - generateToken(userId): sign and return JWT using JWT_SECRET
