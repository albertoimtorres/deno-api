import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getTodos, getTodo, getPagination, postTodo, putTodo, deleteTodo } from './modules/todo.module.ts'
import { login } from './modules/login.module.ts'
import { register } from './modules/register.module.ts'
import { authentication } from './middlewares/auth.ts';

const router = new Router({prefix: '/api/v1'})

router.post('/register', register)
      .post('/login', login)
      .get('/todos', authentication, getTodos)
      .get('/todo/:_id', authentication, getTodo)
      .get('/pagination', authentication, getPagination)
      .post('/create', authentication, postTodo)
      .put('/update', authentication, putTodo)
      .delete('/delete', authentication, deleteTodo)

export default router