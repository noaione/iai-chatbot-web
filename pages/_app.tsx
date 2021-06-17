import React from "react";

import "../styles/global.css";
import type { AppProps } from "next/app";

export default function ChatbotApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
