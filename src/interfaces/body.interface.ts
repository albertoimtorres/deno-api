import { TypeTodo } from './todo.interface.ts'
import { TypeLogin } from './login.interface.ts';
import { TypeRegister } from './register.interface.ts';

export interface IBody {
    value: TypeTodo & TypeLogin & TypeRegister
}