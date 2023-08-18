interface Todo {
    readonly id: number,
    title: string,
    status: boolean,
    description: string,
    user_id: number
}

interface User {
    readonly id: number,
    username: string,
    email: string,
    password: string
}

export { Todo, User }