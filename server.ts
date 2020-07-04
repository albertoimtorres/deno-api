import { requestTraceMiddleware } from "https://raw.githubusercontent.com/deepakshrma/oak_middlewares/master/mod.ts";
import { Application, Middleware, isHttpError, Status } from 'https://deno.land/x/oak/mod.ts'
import { yellow, green } from 'https://deno.land/std/fmt/colors.ts'
import { oakCors } from 'https://deno.land/x/cors/mod.ts'
import "https://deno.land/x/dotenv/load.ts";
import router from './src/router.ts';

const app = new Application()
const port = Number(Deno.env.get('PORT'))

/**
 * HTTP request logger middleware for oak Deno
*/
app.use(requestTraceMiddleware<Middleware>({ type: 'combined' }))

/**
 * CORS to frontend Angular
*/
// app.use(oakCors({ origin: /^.+localhost:4200$/, optionsSuccessStatus: 200 }))

/**
 * CORS to frontend Reactjs
*/
// app.use(oakCors({ origin: /^.+localhost:3500$/, optionsSuccessStatus: 200 }))

app.use(oakCors({
    origin: /^.+localhost:3500$/,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(router.routes())
app.use(router.allowedMethods())

/**
 * Handler error http
*/
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (isHttpError(err)) {
            switch (err.status) {
                case Status.NotFound:
                    ctx.response.status = 404
                    ctx.response.body = { error: 'Not Found' }
                    break
                default:
                    ctx.response.status = 500
                    ctx.response.body = { err }
            }
        } else {
            throw new Error(err)
        }
    }
})

/**
 * Will log the thrown error to the console
*/

app.addEventListener('error', (event) => {
    console.log(event.error)
})

app.addEventListener('listen', ({ secure, hostname, port }) => {
    const protocol = secure ? 'https://' : 'http://'
    const url = `${protocol}${hostname ?? 'localhost'}:${port}`
    console.log(`${yellow("Listening on:")} ${green(url)}`);
})

await app.listen({ port: port })