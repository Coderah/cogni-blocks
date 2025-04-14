<script lang="ts" setup>
import { ref } from 'vue';
import { io } from 'socket.io-client';
import { em } from '../game/entityManager';
import { Direction } from '../game/components';

const socket = io(
    import.meta.env.PROD ? 'wss://cogni.sprixle.studio/' : 'ws://localhost:8000'
);
socket.connect();

socket.on('connect', () => {
    console.log('connected');
});

socket.on('response', (response) => {
    const moves = response.split(',');

    for (let move of moves) {
        if (move in Direction) {
            console.log(
                move,
                em.quickEntity({
                    isMoveSignal: true,
                    moveDirection: move,
                })
            );
        }
    }
});

const isRecording = ref(false);
let mediaStream: MediaStream;
let source: MediaStreamAudioSourceNode;

function stopRecording() {
    source?.disconnect();
    mediaStream?.getTracks().forEach((track) => track.stop());
    isRecording.value = false;
}

async function startRecording() {
    console.log('attempt start recording');
    await recordAudio();
    isRecording.value = true;
}

function toggleRecording() {
    if (!isRecording.value) {
        startRecording();
    } else {
        stopRecording();
    }
}

// Recording audio logic reference:
// https://github.com/google-gemini/multimodal-live-api-web-console/blob/main/src/lib/audio-recorder.ts
function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

async function recordAudio() {
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
            mediaStream = stream;
            const audioContext = new AudioContext({ sampleRate: 16000 });
            source = audioContext.createMediaStreamSource(stream);

            const workletName = 'audio-recorder-worklet';

            const AudioRecordingWorklet = `
            class AudioProcessingWorklet extends AudioWorkletProcessor {

              // send and clear buffer every 2048 samples,
              // which at 16khz is about 8 times a second
              buffer = new Int16Array(2048);

              // current write index
              bufferWriteIndex = 0;

              constructor() {
                super();
                this.hasAudio = false;
              }

              /**
               * @param inputs Float32Array[][] [input#][channel#][sample#] so to access first inputs 1st channel inputs[0][0]
               * @param outputs Float32Array[][]
               */
              process(inputs) {
                if (inputs[0].length) {
                  const channel0 = inputs[0][0];
                  this.processChunk(channel0);
                }
                return true;
              }

              sendAndClearBuffer(){
                this.port.postMessage({
                  event: "chunk",
                  data: {
                    int16arrayBuffer: this.buffer.slice(0, this.bufferWriteIndex).buffer,
                  },
                });
                this.bufferWriteIndex = 0;
              }

              processChunk(float32Array) {
                const l = float32Array.length;

                for (let i = 0; i < l; i++) {
                  // convert float32 -1 to 1 to int16 -32768 to 32767
                  const int16Value = float32Array[i] * 32768;
                  this.buffer[this.bufferWriteIndex++] = int16Value;
                  if(this.bufferWriteIndex >= this.buffer.length) {
                    this.sendAndClearBuffer();
                  }
                }

                if(this.bufferWriteIndex >= this.buffer.length) {
                  this.sendAndClearBuffer();
                }
              }
            }`;

            const script = new Blob(
                [
                    `registerProcessor("${workletName}", ${AudioRecordingWorklet})`,
                ],
                {
                    type: 'application/javascript',
                }
            );

            const src = URL.createObjectURL(script);

            await audioContext.audioWorklet.addModule(src);
            const recordingWorklet = new AudioWorkletNode(
                audioContext,
                workletName
            );

            recordingWorklet.port.onmessage = (ev) => {
                // worklet processes recording floats and messages converted buffer
                const arrayBuffer = ev.data.data.int16arrayBuffer;

                if (arrayBuffer) {
                    const arrayBufferString = arrayBufferToBase64(arrayBuffer);
                    socket.emit('realtimeInput', arrayBufferString);
                }
            };
            source.connect(recordingWorklet);
        });
}
</script>

<template>
    <button @click="toggleRecording">
        {{ isRecording ? 'Stop Realtime' : 'Start Realtime' }}
    </button>
</template>

<style scoped>
button {
    position: absolute;
    z-index: 50;
    font-size: 28px;
}
</style>
