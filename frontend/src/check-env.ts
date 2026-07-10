import { cleanEnv, str } from 'envalid'


cleanEnv(import.meta.env, {
    VITE_API_URL: str(),
    VITE_NOVU_APPLICATION_IDENTIFIER: str()
})