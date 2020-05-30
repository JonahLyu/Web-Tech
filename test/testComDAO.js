var comDAO = require('../dao/comDAO')

console.log("test comDAO")
let postID = 2
let content = "hello"
let userID = 13
let date = "May 20"
console.log("test create")
// comDAO.createCom(postID, content, userID, date)
// comDAO.createCom(postID, content, userID, date)
// comDAO.createCom(postID, content, userID, date)

// console.log("test delete")
// comDAO.deleteCom(1)

console.log("test get")
comDAO.getComByPostID(2, (results)=>{
    console.log(results);
})

console.log("test add like")
comDAO.addComLike(2)
