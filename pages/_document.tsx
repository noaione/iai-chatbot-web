import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

class DocumentContext extends Document {
    render() {
        return (
            <Html>
                <Head />
                <body className="bg-gray-900 text-gray-50 font-inter">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default DocumentContext;
