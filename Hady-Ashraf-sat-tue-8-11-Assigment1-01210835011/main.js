// Q1
let str = "123";
let num = Number(str);
console.log(num + 7);


// Q2
let value = 0;
if (!value) {
  console.log("Invalid");
}


// Q3
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);
}


// Q4
let numbers = [1, 2, 3, 4, 5];
let evenNumbers = numbers.filter(function (n) {
  return n % 2 === 0;
});
console.log(evenNumbers);


// Q5
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let mergedArr = [...arr1, ...arr2];
console.log(mergedArr);


// Q6
function getDay(num) {
  switch (num) {
    case 1: return "Sunday";
    case 2: return "Monday";
    case 3: return "Tuesday";
    case 4: return "Wednesday";
    case 5: return "Thursday";
    case 6: return "Friday";
    case 7: return "Saturday";
  }
}
console.log(getDay(1));


// Q7
let words = ["a", "ab", "abc"];
let lengths = words.map(function (w) {
  return w.length;
});
console.log(lengths);


// Q8
function checkDivisible(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "Divisible by both";
  }
}
console.log(checkDivisible(15));


// Q9
const square = (num) => num * num;
console.log(square(5));


// Q10
function formatPerson(person) {
  let { name, age } = person;
  return name + " is " + age + " years old";
}
const person = { name: "John", age: 25 };
console.log(formatPerson(person));


// Q11
function sum(...nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
  }
  return total;
}
console.log(sum(1, 2, 3, 4, 5));


// Q12
function waitAndResolve() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("Done");
    }, 3000);
  });
}
waitAndResolve().then(function (msg) {
  console.log(msg);
});


// Q13
function largestNumber(arr) {
  let largest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }
  return largest;
}
console.log(largestNumber([1, 3, 7, 2, 4]));


// Q14
function getKeys(obj) {
  return Object.keys(obj);
}
console.log(getKeys({ name: "John", age: 30 }));


// Q15  
function splitWords(str) {
  return str.split(" ");
}
console.log(splitWords("It's too hot"));