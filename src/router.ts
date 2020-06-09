import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getTodos, getTodo, postTodo, putTodo, deleteTodo } from './modules/todo.module.ts';

const router = new Router()

router.get('/todos', getTodos)
router.get('/todo/:_id', getTodo)
router.post('/create', postTodo)
router.put('/update', putTodo)
router.delete('/delete', deleteTodo)

export default router