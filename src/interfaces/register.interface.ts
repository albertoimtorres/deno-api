type Require<T> = {
    [P in keyof T]-?: T[P]
}

export interface IRegister {
    email: string
    password: string
}

export type TypeRegister = Require<IRegister>