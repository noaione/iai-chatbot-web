import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";

import { useScript } from "../lib/script";

interface CommentData {
    children?: string;
}

function createComment(comment?: string) {
    if (!comment) {
        return `<!-- (empty) -->`;
    }
    if (comment.includes("\n")) {
        return `<!--\n${comment}\n-->`;
    }
    return `<!-- ${comment} -->`;
}

function ReactComment(props: CommentData) {
    const el = useRef<HTMLDivElement>();
    useEffect(() => {
        if (el?.current) {
            try {
                el.current.outerHTML = createComment(props.children);
            } catch (e) {
                console.error("[ReactComment] Failed to mount the comment data to an Element!");
            }
        }
    }, []);

    return <div ref={el} />;
}

interface GroupMemberProps {
    name: string;
    tp: string;
}

function GroupMember(props: GroupMemberProps) {
    return (
        <li className="mt-1 leading-relaxed">
            {props.name}{" "}
            <span className="text-gray-300 text-sm font-semibold">
                {"(TP" + props.tp.toUpperCase() + ")"}
            </span>
        </li>
    );
}

export default function MainHomepage() {
    const configBot = {
        bot_key: "75bc844375b54148",
        welcome_msg: true,
        branding_key: "default",
        server: "https://app.engati.com",
        e: "p",
    };
    const status = useScript(
        `https://app.engati.com/static/js/chat_widget.js?config=${encodeURIComponent(
            JSON.stringify(configBot)
        )}`
    );
    return (
        <>
            <Head>
                <title>IAI Chatbot - Group 15</title>
                <meta name="description" content="A Food Chatbot made by Group 15 for IAI Project" />
            </Head>
            <ReactComment>Website created with Next.JS and React</ReactComment>
            <ReactComment>The website also have public API that you can possibly use</ReactComment>
            <ReactComment>
                Just check the source code for more info:
                https://github.com/noaione/iai-chatbot-web/tree/master/pages/api
            </ReactComment>
            <div className="flex flex-col">
                <div className="flex flex-col justify-center items-center p-5">
                    <div className="flex flex-col justify-center mt-8">
                        <Image src="/apple-icon-114x114.png" width={114} height={114} alt="The Cake Icon" />
                    </div>
                    <h1 className="font-bold text-4xl mt-4">A Food Chatbot</h1>
                    <h3 className="text-xl mt-2 font-semibold">Created by: Group 15</h3>
                    {status !== "ready" ? (
                        <p>Please wait until our Bot is ready...</p>
                    ) : (
                        <p className="whitespace-pre-wrap mt-1">
                            Our bot should be loaded now, please check your bottom-right screen for the popup
                            button
                        </p>
                    )}
                </div>
                <hr className="mt-5 mb-2" />
                <div className="flex flex-col p-5">
                    <h2 className="text-2xl mb-2 font-semibold">About</h2>
                    <p>
                        This bot was created for our Class Project of Introduction to Artificial Intelligence.
                    </p>
                    <p>Our group picked a Problem Domain of Food related stuff.</p>
                    <p>Our group consist of:</p>
                    <ol className="list-decimal list-inside gap-2">
                        <GroupMember name="Gabrielly Caroline" tp="061805" />
                        <GroupMember name="Kevin Prasetia Kumala" tp="058198" />
                        <GroupMember name="Muhammad I'zaz Al-Aiman Maharana Hart" tp="062341" />
                        <GroupMember name="Valeria Angela Liviany" tp="058782" />
                    </ol>
                    <p className="mt-1">
                        If you have a second, we would like you to fill our questionaire about our Bot:
                    </p>
                    <div className="mt-1 ml-1">
                        <a
                            className="hover:underline text-red-400"
                            href="https://forms.gle/o4DRgkfuBPWht8Vb6"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            &lt;&lt; Click here &gt;&gt;
                        </a>
                    </div>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="flex flex-row gap-1 p-5 justify-center">
                    <span>This website is Open Source </span>
                    <a
                        className="text-red-400 hover:underline"
                        href="https://github.com/noaione/iai-chatbot-web"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        See on GitHub
                    </a>
                </div>
            </div>
        </>
    );
}
