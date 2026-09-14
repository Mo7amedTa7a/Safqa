// Member 1 - Auth Service
// register(data)             → POST   /api/auth/register
// login(email, password)     → POST   /api/auth/login
// logout()                   → POST   /api/auth/logout
// getMe()                    → GET    /api/auth/me
// changePassword(data)       → PATCH  /api/auth/change-password
// forgotPassword(email)      → POST   /api/auth/forgot-password
// resetPassword(token, pass) → POST   /api/auth/reset-password/:token
// isLoggedIn()               → boolean
// getCurrentUser()           → BehaviorSubject<User | null>
// getRole()                  → string
// saveToken(token)           → localStorage
// clearSession()             → مسح كل session data
