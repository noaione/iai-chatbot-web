/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EDAMAM_APP_ID?: string;
            EDAMAM_APP_SECRET?: string;
        }
    }
}
