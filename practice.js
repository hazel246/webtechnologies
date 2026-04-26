


/*

The 3 things exams trick you on most:

-Forgetting new with constructor functions
-Value vs reference output questions (the x++ vs x.value++ one)
-Shallow copy thinking it's deep (spread only copies surface level)

Type each one out once. Don't copy paste. You'll have it locked in.

*/

//1. Object Literal
//properties + a method inside {}. That's it.
let circle = {

    radius: 1,
    border: 2,
    draw: function() {

        console.log('draw');
    }
}
circle.draw();


//2. Factory Function
//it's just a regular function that RETURNS an object, no new 
function createCircle(radius, border){
    return {

        radius: radius,
        border: border,
        getArea: function(){
            return Math.PI * this.radius * this.radius;
        }
    };
}

let myCircle = createCircle(1,2);


//3.Constructor Function
//capital C, uses this, MUST use new. Exams love asking what happens if you forget new

function Circle(radius){

    this.radius=radius;
    this.draw = function(){

        console.log("Draw: r= " + radius);

    }
}

const c = new Circle(5);
c.draw();


//4. Value vs Reference Types
//the classic trick question. Primitives = safe copy. Objects = same kitchen.

//Primitives - copied by Value
let x = 10;
let y = x;
x = 20;
//y is still 10 

//Objects - copied by Reference
let x = {
    value: 10
};

let y=x;
x.value=20;
//y.value is also 20 too


//5. The trick question slide (they will ask this)
//primitive passed in = untouched. object passed in = mutated.
let x =10;
function increase(x) {
    x++;
}
increase(x);
console.log(x) // still 10

let y = {
    value: 10
};
function increaseObj(y) {

    y.value++;
}
increaseObj(y);
console.log(y.value) // 11



//6.Prototype(Best Practice)
//instead of putting draw inside the constructor (creates a copy per object), 
// you put it on the prototype once. 1000 circles, 1 draw function in memory.
Circle.prototype.draw = function() {

    console.log("draw");

}

//7. Protypical Inheritance Setup
//Object.create sets up the chain. 
//The second line fixes the constructor back to Circle (exams ask why this line is needed).
function Shape(){
}
function Circle(){
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;



//8. Call Super Constructor (Borrowing)
//.call(this, ...) is how you call the parent constructor in the old style.
function Rectangle(color) {
    Shape.call(this, color); //.call(this) basically means: "run this function, but pretend this is MY object, not yours."
    //That's it. You're borrowing someone else's function and running it in your own context.
}


function Rectangle(color) {
  Shape.call(this, color);
  // "Hey Shape, run YOUR constructor,
  //  but use MY 'this' (the Rectangle being built right now)"
}

const r = new Rectangle("red");
console.log(r.color); // "red"

//Shape is a form you have to fill out. 
// .call(this) 
//means "fill out Shape's form but write MY name at the top."






//???????????????????????????????????
//9. Method Overriding 
//child overrides parent, but can still call the parent version using .call(this).
Shape.prototype.draw = function(){

}
Circle.prototype.draw = function(){
    Shape.prototype.draw.call(this); //call parent
    // add extra stuff
}


//Circle is a new employee. Drawing a shape has a standard checklist (Shape's version). 
// Circle does the standard checklist first, then adds its own extra steps on top. 
// .call(this) makes sure the checklist is filled in with Circle's own data, not Shape's.






//10. ES6 Class(same thing, cleaner look)
class Circle{

    constructor(radius){
        this.radius=radius;
    }

    draw() {
        console.log("draw");
    }

}

//11. ES6 Inheritance
//extends + super() in constructor + super.method() to call parent method. 
//Same logic as the old way, just cleaner.
class Triangle extends Shape {

    constructor(color){
        super(color);
    }

    draw(){
        super.draw();
        //extra stuff
    }
}

//12. Arrow Functions
hello = () => "Hello World!";
hello = (val) => "Hello" + val;
hello = val => "Hello " + val; // parens optional with 1 param

//13. let vs var (block scope)
var x = 10;
{
    var x = 2;
}
//x is now 2 outside

let x = 10;
{
    let x = 2;
}
// x is still 10 outside




//14. template literals
let name = "Hafsa";
let text = `Welcome ${name}!`; 

let price = 10;
let VAT = 0.25;
let total = `Total: ${(price * (1 + VAT)).toFixed(2)}`;  

//Backticks ( Inject variables directly into a string) don't care about single quotes inside them at all. 
// You only run into trouble if you try to put a backtick inside a backtick. 
// That's the only character you'd need to escape with a \.


//15. Destructing
//Arrays
const vehicles = ['mustang','f-150','expedition'];
const [car, truck, suv] = vehicles;

//Objects
const { name, age, city } = person;


//16. Spread + Shallow vs Deep Copy
//spread = shallow. JSON.parse(JSON.stringify()) = deep. Exam will 100% ask the difference.

//Merge Arrays
const combined = [...numbersOne, ...numbersTwo];

//Shallow copy (nested objects still linked)
const shallowCopy = { ...originaiObject };

//Deep copy (fully disconnected)
const deepCopy = JSON.parse(JSON.stringify(originalObject));



//17. Array find()
const ages = [3, 10, 18,20];
ages.find(age => age>18); //returns 20


//18. Array splice()
//splice(index, howManyToRemove, ...itemsToAdd). 0 means remove nothing, just insert.
const fruits = ["Banana", "Orange" , "Apple", "Mango"];
fruits.splice(2,0,"Lemon","Kiwi");

// ["Banana", "Orange", "Lemon", "Kiwi", "Apple", "Mango"]



//19. Array map();
const numbers = [65, 44,12,4];
const newArr = numbers.map(num => num *10);
// [650, 440, 120, 40]


//20. Array filter();
const ages = [32, 33, 16, 40];
const result = ages.filter(age => age >= 18);
// [32, 33, 40]

