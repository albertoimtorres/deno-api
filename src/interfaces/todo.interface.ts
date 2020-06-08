import { ObjectId } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

type Complete<T> = {
    [P in keyof Required<T>]: Pick<T,P> extends Required<Pick<T, P>> ? T[P] : (T[P] | undefined)
}

interface ITodo {
    _id?: ObjectId
    name: string
}

export type TypeTodo = Complete<ITodo>