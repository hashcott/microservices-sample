

(async () => {
        const axios = require("axios")
        const resUser = await axios.get(`http://172.23.0.3:3000/profile`, {
            headers: {
                "x-auth-token": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMzRjNTZlODAwY2E0MDAxMTVhMGNjNSIsImlhdCI6MTYxNDA3MTE1MCwiZXhwIjoxNjE0MzMwMzUwfQ.tab1JDYFNb0VMkuhNv0B0625LPC4jlUw-7qWBWsd3-A`
            }
        })
        const user = resUser.data;
        console.log(user);
})()