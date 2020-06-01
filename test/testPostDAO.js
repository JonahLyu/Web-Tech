var joinDAO = require('../dao/joinDAO')

joinDAO.search("Bristol", (data)=>{
    console.log(data);
    console.log(data.length);
})
