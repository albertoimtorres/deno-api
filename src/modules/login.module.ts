import { TypeLogin } from '../interfaces/login.interface.ts';
import { IBody } from '../interfaces/body.interface.ts';
import { verifyPass } from '../utils/crypto.ts';
import { makeJWT } from '../utils/jwt.ts';
import db from '../source.ts';

/**
 * Get collection
*/
const user = db.collection(`${Deno.env.get('COLLECTION_REGISTER')}`)

export const login = async ({request, response}: {request: any, response: any}) => {
    
    const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    
    if (!request.hasBody) {
        request.status = 400
        request.body = {
            error: `Data no provided`
        }
    } else {
        const body = await request.body({
            contentTypes: {
                text: ['application/ld+json']
            }
        }) as IBody

        let { email, password } = body.value as TypeLogin

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
                let userFind = await user.findOne({ email: email })
                if (!userFind) {
                    response.status = 409
                    response.body = {
                        error: `Unregistered user`
                    }
                } else {
                    let verify = await verifyPass(userFind.password)
                    if (verify) {
                        let token = await makeJWT(email);
                        response.status = 200
                        response.body = {
                            _id: userFind._id.$oid,
                            email,
                            token
                        }
                    } else {
                        response.status = 409
                        response.body = {
                            error: `Password incorrect, please verify it`
                        }
                    }
                }
            }
        }
    }
}