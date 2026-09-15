// Async Handler Wrapper
// - Wraps async controller/service functions
// - Catches any rejected Promise and forwards the error to next()
// - Eliminates repetitive try/catch blocks in controllers
// Usage: router.get('/', asyncHandler(async (req, res, next) => { ... }))

const asyncHandler = (fun) => {
    return (req, res, next) => {
        Promise.resolve(fun(req, res, next)).catch(next)
    }
}

export default asyncHandler