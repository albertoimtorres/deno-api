import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getPage, postTodo, putTodo } from './modules/todo.module.ts';

const router = new Router()

router.get('/', getPage)
router.post('/create', postTodo)
router.put('/update', putTodo)

export default router