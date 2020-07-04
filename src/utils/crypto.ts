import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'


export const signPass = async (password: string) => {
    return await bcrypt.hash(password);
}

export const verifyPass = async (password: string) => {
    const hash = await signPass(password)
    return await bcrypt.compare(password, hash)
}