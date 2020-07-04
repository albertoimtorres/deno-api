import { Context, Middleware } from 'https://deno.land/x/oak/mod.ts'
import { validateJWT } from '../utils/jwt.ts'

export const authentication = async (ctx: Context, next: any) => {
    const headers: Headers = ctx.request.headers
    const authorization = headers.get('Authorization')

    if (!authorization) {
        ctx.response.status = 401
        ctx.response.body = {
            error: `Token no provided`
        }
    } else {
        const token = authorization.split(' ')[1]
        const isValid = await validateJWT(token)
        if (isValid) {
            await next()
        } else {
            ctx.response.status = 401
            ctx.response.body = {
                error: `Unauthorized token`
            }
        }
    }
}