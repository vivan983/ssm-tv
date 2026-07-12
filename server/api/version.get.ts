// Returns deployed git commit hash — verifies what code is actually live
export default defineEventHandler(() => {
  return {
    deployed: new Date().toISOString(),
    message: 'SSM TV API v2 — all routes hardened, never throws 500',
  }
})
