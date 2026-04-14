import { createServer } from 'node:http'
import { createApplication } from './app.js'
import dotenv from 'dotenv'

dotenv.config();

async function main() {
    try {
        const server = createServer(createApplication())
        const PORT = process.env.PORT || 3000

        server.listen(PORT, () => {
            console.log(`Http server is running on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(`Error starting http server`)
        throw error
    }
}

main()