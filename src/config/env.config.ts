import * as dotenv from 'dotenv'
dotenv.config()

export const envConfig = () => {
    return {
        port: process.env.PORT || 3001
    }
}