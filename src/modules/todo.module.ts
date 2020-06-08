
import { TypeTodo } from '../interfaces/todo.interface.ts'
import { IBody } from '../interfaces/body.interface.ts';
import todo from '../source.ts'

export const getPage = ({ response }: { response: any }) => {
    response.body = {
        saludo: '¡Hola Mundo!'
    }
}

export const postTodo = async ({ request, response }: { request: any, response: any }) => {
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            error: `No data provided`
        }
        return;
    }

    const body = await request.body({
        contentTypes: {
            text: ['application/ld+json']
        }
    }) as IBody

    const data = body.value as TypeTodo

    /**
     * En caso de no realizar un index en la base de datos con el campo name
     * se realiza la consulta con el aggregate para validar insertar datos repetidos.
    */
    const todoFind = await todo.aggregate([ { $match: data }, { $group: { _id: '$name', total: { $sum: 1 } } } ])

    if (!todoFind.length) {
        const newTodo = await todo.insertOne(data)
        response.body = {
            status: 200,
            success: `Success request, resource saved with id: ${newTodo.$oid}`
        }
    } else {
        response.body = {
            status: 409,
            error: `Request could not be completed due to a conflict, the resource ${body.value.name} is already registered`
        }
    }

}