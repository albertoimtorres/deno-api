type Require<T> = {
    [P in keyof T]-?: T[P]
}

export interface ILogin {
    email: string
    password: string
}

export type TypeLogin = Require<ILogin>