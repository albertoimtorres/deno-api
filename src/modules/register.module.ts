import { IBody } from '../interfaces/body.interface.ts';
import { TypeRegister } from '../interfaces/register.interface.ts'
import { IRegister } from '../interfaces/register.interface.ts'
import { signPass } from '../utils/crypto.ts'
import db from '../source.ts';

/**
 * Get collection
*/
const user = db.collection(`${Deno.env.get('COLLECTION_REGISTER')}`)

export const register = async ({request, response}: { request: any, response: any }) => {
    
    const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    /**
     * /^
     * (?=.*\d)          // should contain at least one digit
     * (?=.*[a-z])       // should contain at least one lower case
     * (?=.*[A-Z])       // should contain at least one upper case
     * [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
     * $/
    */
    const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            error: `No data privided`
        }
    } else {
        const body = await request.body({
            contentTypes: {
                text: ['application/ld+json']
            }
        }) as IBody

        const { email, password } = body.value as TypeRegister

        if (!email) {
            response.status = 400
            response.body = {
                error: `Email required`
            }
        } else if (!password) {
            response.status = 400
            response.body = {
                error: `Password required`
            }
        } else {
            if (!regexEmail.test(email)) {
                response.status = 400
                response.body = {
                    error: `Email not valid`
                }
            } else if (!regexPass.test(password)){
                response.status = 400
                response.body = {
                    error: `Password not valid`
                }
            } else {
                const userFind = await user.findOne({ email: email })
                if (!userFind) {
                    const sign = await signPass(password)
                    const newUser = await user.insertOne({ email, password: sign })
                    response.status = 200
                    response.body = {
                        success: `Success request, user created with id: ${newUser.$oid}`
                    }
                } else {
                    response.status = 409
                    response.body = {
                        error: `User register previously`
                    }
                }
            }
        }
    }
}