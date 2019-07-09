#!/bin/bash


#Open car-dashboard for Conversation-STT-TTS
cd car-dashboard
npm start &


#Open visual-recognition-nodejs for Visual Recognition
x-terminal-emulator 
cd ..
cd visual-recognition-nodejs
npm start
