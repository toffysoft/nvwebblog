let users = [
  {
    "name":"chayapon",
    "lastname":"chandra",
    "email":"gooddev639@gmail.com",
    "from":"Thailand"
  },
  {
    "name":"Job",
    "lastname":"Steve",
    "email":"steve.job@gmail.com",
    "from":"USA"
  },
]

// # sample 1 ----------------
/* console.log('Name: ' + users[0].name + ' ' + users[0].lastname)
console.log('Name: ' + users[1].name + ' ' + users[1].lastname)

for (let i = 0; i < 2; i++) {
  console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
} */


// # sample 2 ------------------
/* let userA = 
  {
    "name":"AAA",
    "lastname":"AAAAA",
    "email":"AAA@gmail.com",
    "from":"Thailand"
  }

  let userB = 
  {
    "name":"BBB",
    "lastname":"BBBBB",
    "email":"BBB@gmail.com",
    "from":"Thailand"
  }

users.push(userA)
users.push(userB)

for (let i = 0; i < users.length; i++) {
  console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
} */

// #sample 3 --------------------
/* let userA = 
  {
    "name":"AAA",
    "lastname":"AAAAA",
    "email":"AAA@gmail.com",
    "from":"Thailand"
  }

  let userB = 
  {
    "name":"BBB",
    "lastname":"BBBBB",
    "email":"BBB@gmail.com",
    "from":"Thailand"
  }

users.push(userA)
users.push(userB)

let userSelect = users.splice(2,2)

for (let i = 0; i < users.length; i++) {
  console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
}

console.log('----------------------')

for (let i = 0; i < userSelect.length; i++) {
  console.log('Name: ' + userSelect[i].name + ' ' + userSelect[i].lastname)
} */

// #sample 4 ---------------------
/* let userA =
  {
  "name":"AAA",
  "lastname":"AAAAA",
  "email":"AAA@gmail.com",
  "from":"Thailand"
  }

let userB =
  {
  "name":"BBB",
  "lastname":"BBBBB",
  "email":"BBB@gmail.com",
  "from":"Thailand"
  }

users.push(userA)
users.push(userB)

// delete users.splice(0,1)

for (let i = 0; i < users.length; i++) {
  console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
}

let userSelect = users.splice(2,2)
console.log('------------------')

for (let i = 0; i < userSelect.length; i++) {
  console.log('Name: ' + userSelect[i].name + ' ' + userSelect[i].lastname)
} */

let userA =
{
"name":"AAA",
"lastname":"AAAAA",
"email":"AAA@gmail.com",
"from":"Thailand"
}

let userB =
{
"name":"BBB",
"lastname":"BBBBB",
"email":"BBB@gmail.com",
"from":"Thailand"
}

users.push(userA)
users.push(userB)

for (let i = 0; i < users.length; i++) {
console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
}

delete users.splice(0,1)

console.log('\n*** After Delete\n')

for (let i = 0; i < users.length; i++) {
console.log('Name: ' + users[i].name + ' ' + users[i].lastname)
}