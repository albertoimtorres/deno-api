
import { TypeTodo } from '../interfaces/todo.interface.ts'
import { IBody } from '../interfaces/body.interface.ts';
import todo from '../source.ts'

/**
 * [GET] http://127.0.0.1:3005/todos
*/
export const getTodos = async ({ request, response }: { request: any, response: any }) => {
    const data = await todo.find({ name: { $ne: null } })
    response.body = {
        status: 200,
        data
    }
}

/**
 * [GET] http://127.0.0.1:3005/todo/5edfcc3500cc3198003ec638
*/
export const getTodo = async ({ request, response, params }: { request: any, response: any, params: { _id: string } }) => {
    const data = await todo.findOne({ _id: { $oid: params._id } })
    response.body = {
        status: 200,
        data
    }
}

/**
 * [POST] http://127.0.0.1:3005/create
 * 
 * Postman option raw JSON
 * {"name": "Nodejs"}
*/
export const postTodo = async ({ request, response }: { request: any, response: any }) => {
    if (!request.hasBody) {
        response.body = {
            status: 400,
            error: `No data provided`
        }
    } else {
        const body = await request.body({
            contentTypes: {
                text: ['application/ld+json']
            }
        }) as IBody
    
        const data = body.value as TypeTodo
    
        /**
         * En caso de no realizar un index en la base de datos con el campo name
         * se realiza la consulta con el aggregate para evitar la insercción datos repetidos.
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

}

/**
 * [PUT] http://127.0.0.1:3005/update
 * 
 * Postman option raw JSON
 * {"_id": "5edfcc3500cc3198003ec638", "name": "JavaScript"}
*/
export const putTodo = async ({ request, response }: { request: any, response: any }) => {
    if (!request.hasBody) {
        response.body = {
            status: 400,
            error: `No data provided`
        }
    } else {
        const body = await request.body({
            contentTypes: {
                text: ['appplication/ld+json']
            }
        }) as IBody;
    
        const data = body.value as TypeTodo
    
        const { modifiedCount } = await todo.updateOne({ _id: { $oid: data._id } }, { name: data.name })
    
        if (modifiedCount === 1) {
            response.body = {
                status: 200,
                success: `Success request, resource update with id: ${data._id}`
            }
        } else {
            response.body = {
                status: 400,
                error: `Request cannot processed`
            }
        }
    }
}

/**
 * [DELETE] http://127.0.0.1:3005/delete
 * 
 * Postman option raw JSON
 * {"_id": "5edfcc3500cc3198003ec638"}
*/
export const deleteTodo = async ({ request, response }: { request: any, response: any }) => {
    if (!request.hasBody) {
        response.body = {
            status: 400,
            error: `No data provided`
        }
    } else {
        const body = await request.body({
            contentTypes: {
                text: ['appplication/ld+json']
            }
        }) as IBody;
    
        const data = body.value as TypeTodo
    
        const deleteTodo = await todo.deleteOne({ _id: { $oid: data._id } })
    
        if (deleteTodo === 1) {
            response.body = {
                status: 200,
                success: `Success request, resource delete with id: ${data._id}`
            }
        } else {
            response.body = {
                status: 400,
                error: `Request cannot processed`
            }
        }
    }
}