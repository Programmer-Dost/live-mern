"use strict";
// Hello World in ts
function Hello(name) {
    return name + " Hello World";
}
console.log(Hello("typ"));
let obj = {
    username: "user1",
    email: "user1@example.com",
    id: 1
};
// enums
var params;
(function (params) {
    params["up"] = "up";
    params["down"] = "down";
    params["left"] = "left";
    params["right"] = "right";
})(params || (params = {}));
//Generics: Can't specify different data type functions together
function oldElem(num, params) {
    return num[0];
}
let oldArg = oldElem(["up", "down", "left", "right"], params.right);
// console.log(oldArg.toUpperCase())
//Generics: Can specify different data type functions together 
function elem1(args, params) {
    return args[0];
}
let arg1 = elem1(["hello"], params.up);
console.log(arg1.toUpperCase());
function identity(args) {
    return args;
}
let output1 = identity("myString");
let output2 = identity(2);
