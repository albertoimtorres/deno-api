import { Application } from 'https://deno.land/x/oak/mod.ts'
import { yellow, green } from 'https://deno.land/std/fmt/colors.ts'
import router from './src/router.ts';

const app = new Application()
const port = 8009

app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener('listen', ({ secure, hostname, port }) => {
    const protocol = secure ? 'https://' : 'http://'
    const url = `${protocol}${hostname ?? 'localhost'}:${port}`
    console.log(`${yellow("Listening on:")} ${green(url)}`);
})

await app.listen({ port: port })