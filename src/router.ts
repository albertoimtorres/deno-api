import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getPage, postTodo } from './modules/todo.module.ts';

const router = new Router()

router.get('/', getPage)
router.post('/create', postTodo)

export default router