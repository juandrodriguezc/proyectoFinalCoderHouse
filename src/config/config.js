import dotenv from "dotenv"

dotenv.config({
    path:"./src/.env", override: true
})

export const config={
    PORT:process.env.PORT||3001,
    MONGO_URL: process.env.MONGO_URL,
    MODE:process.env.MODE||"development",
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    EMAIL: process.env.EMAIL,
    EMAILPASSWORD: process.env.EMAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET
}