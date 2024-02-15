// Hello World in ts
function Hello(name: string): string{
    return name + " Hello World"
}
console.log(Hello("typ"))

//interfaces
interface myObj {
    username: string,
    email: string,
    id: number
}
let obj:myObj = {
    username: "user1",
    email: "user1@example.com",
    id:1
}
// enums
enum params{
    up = "up",
    down = "down",
    left ="left",
    right = "right"
}
type input = number | string

//Generics: Can't specify different data type functions together
function oldElem(num:input[], params:params):input{
   
return num[0]
}
let oldArg = oldElem(["up", "down", "left", "right"], params.right)
// console.log(oldArg.toUpperCase())

//Generics: Can specify different data type functions together 
function elem1<T>(args:T[], params:params){
return args[0]
}
let arg1 = elem1(["hello"], params.up)
console.log(arg1.toUpperCase())

function identity<T>(args:T):T{
    return args
}
let output1 = identity<string>("myString")
let output2 = identity<number>(2)
