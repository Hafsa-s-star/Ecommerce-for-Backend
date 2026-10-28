import "dotenv/config";
import app from "./src/app.js"
import connectDB from "./src/db/db.js"
const port = 3000
 await connectDB()

app.listen(port, async() => {
    console.log(`Example app listening on port ${port}`)
})