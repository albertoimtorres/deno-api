import { helpers, Status } from 'https://deno.land/x/oak/mod.ts';
import { TypeTodo } from '../interfaces/todo.interface.ts'
import { IBody } from '../interfaces/body.interface.ts'
import todo from '../source.ts'

const { getQuery } = helpers;

/**
 * [GET] http://127.0.0.1:3005/todos
*/
export const getTodos = async ({ request, response }: { request: any, response: any }) => {
    try {
        const data = await todo.find({ name: { $ne: null } })
        response.status = 200
        response.body = {
            data
        }
    } catch (error) {
        response.status = 500
        response.body = {
            error
        }
    }
}

/**
 * [GET] http://127.0.0.1:3005/todo/5edfcc3500cc3198003ec638
*/
export const getTodo = async ({ request, response, params }: { request: any, response: any, params: { _id: string } }) => {
    try {
        const data = await todo.findOne({ _id: { $oid: params._id } })
        response.status = 200
        response.body = {
            data
        }
    } catch (error) {
        response.status = 500
        response.body = {
            error
        }
    }
}

/**
 * [GET] http://127.0.0.1:3005/api/v1/pagination?skip=1&limit=5
*/
export const getPagination = async (ctx: any, next: any) => {
    let query = getQuery(ctx, { mergeParams: true });

    if (!query.limit) {
        ctx.response.status = 400
        ctx.response.body = {
            error: `Request required limit query param`
        };
    } else if (!query.skip) {
        ctx.response.status = 400
        ctx.response.body = {
            error: `Request required skip query param`
        };
    } else {
        let skip = Number(query.skip); /* Current page */
        let limit = Number(query.limit); /* Elements number per page */

        if (skip < 0 || skip === 0) {
            ctx.response.status = 400
            ctx.response.body = {
                error: `Invalid page number, should start with 1`
            };
        } else {
            try {
                // const pagination = await todo.aggregate([ { $match: {} }, { $skip: (skip - 1) * limit }, { $limit: limit } ]) /* Calculated number total element per page */
                const data = await todo.aggregate([ { $match: {} }, { $skip: ((limit * skip) - limit) }, { $limit: limit } ])
                const [ count ] = await todo.aggregate([ { $match: {} }, { $count: "name" } ])
                ctx.response.status = 200
                ctx.response.body = {
                    data,// pagination,
                    current: skip,
                    pages: (count && count.name) ? Math.ceil(count.name / limit) : 0 /* Total pages */
                }
            } catch (err) {
                ctx.response.status = 500
                ctx.response.body = {
                    err
                };
            }
        }
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
        response.status = 400
        response.body = {
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
            response.status = 200
            response.body = {
                success: `Success request, resource saved with id: ${newTodo.$oid}`
            }
        } else {
            response.status = 409
            response.body = {
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
        response.status = 400
        response.body = {
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
            response.status = 200
            response.body = {
                success: `Success request, resource update with id: ${data._id}`
            }
        } else {
            response.status = 400
            response.body = {
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
        response.status = 400
        response.body = {
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
            response.status = 200
            response.body = {
                success: `Success request, resource delete with id: ${data._id}`
            }
        } else {
            response.status = 400
            response.body = {
                error: `Request cannot processed`
            }
        }
    }
}