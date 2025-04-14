import * as types from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import express from 'express';

import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';

import config from './config';

export function createBlob(audioData: string): types.Blob {
    return { data: audioData, mimeType: 'audio/pcm;rate=16000' };
}

export function debug(data: object): string {
    return JSON.stringify(data);
}

const RULES_PROMPT = `You are a game command parser. Convert the user's natural language into exact move commands.


RULES:

1. Only allow these directions: UP,DOWN,LEFT,RIGHT
2. Output must comma-separated values
3. Repeat direction for each step (e.g., "3 left" becomes LEFT,LEFT,LEFT)
4. Ignore any non-movement commands
5. the game board limits are 64x64
6. If you cannot answer with moves in that format, reply with a blank message

if you understand, reply to this message with READY`;

async function main() {
    const options: types.GoogleGenAIOptions = {
        // Google AI
        vertexai: false,
        apiKey: config.GEMINI_API_KEY,
        apiVersion: 'v1alpha',
    };
    const model = 'gemini-2.0-flash-live-001';

    const ai = new GoogleGenAI(options);

    const app = express();
    app.use(cors({ origin: 'sprixle.studio' }));
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: 'sprixle.studio',
        },
    });

    // app.get('/', function (req: Request, res: Response) {
    //     res.sendFile(path.join(process.cwd(), 'index.html'));
    // });

    io.on('connection', async function (socket: Socket) {
        console.log('[CLIENT] connected');
        socket.on('disconnection', () => {
            console.log('[CLIENT] disconnected');
        });

        const session = await ai.live.connect({
            model: model,
            config: {
                responseModalities: [types.Modality.TEXT],
            },
            callbacks: {
                onopen: () => {
                    console.log('[AI CONN] Open');
                },
                onmessage: (message: types.LiveServerMessage) => {
                    console.log('[AI CONN MESSAGE]', debug(message));
                    if (
                        message.serverContent &&
                        message.serverContent.modelTurn &&
                        message.serverContent.modelTurn.parts &&
                        message.serverContent.modelTurn.parts.length > 0
                    ) {
                        console.log(message.serverContent.modelTurn.parts);
                        const parts = message.serverContent.modelTurn.parts
                            .map((p) => p.text)
                            .join('')
                            .replace(/\n/g, ',');

                        socket.emit('response', parts);
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('[AI CONN ERROR]', debug(e));
                },
                onclose: (e: CloseEvent) => {
                    console.warn('[AI CONN CLOSED]', debug(e));
                },
            },
        });

        session.sendClientContent({
            turns: RULES_PROMPT,
            turnComplete: true,
        });

        socket.on('realtimeInput', function (audioData: string) {
            session.sendRealtimeInput({ media: createBlob(audioData) });
        });
    });

    server.listen(config.PORT, async () => {
        console.log(`Server running on port ${config.PORT}`);
    });
}

main();
