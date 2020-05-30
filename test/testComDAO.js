var comDAO = require('../dao/comDAO')

console.log("test comDAO")
let postID = 2
let content = "hello"
let userID = 13
let date = "May 20"
console.log("test create")
comDAO.createCom(postID, content, userID, date)

console.log("test delete")
comDAO.deleteCom(4, "13")

console.log("test get")
comDAO.getComByPostID(2, (results)=>{
    console.log(results);
})

console.log("test add like")
comDAO.addComLike(3)

console.log("test get like count")
comDAO.getComLikeByID(3, (result)=>{
    console.log(result);
})
