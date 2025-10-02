import create from 'zustand';
import { nanoid } from 'nanoid';


export type Message = {
id: string;
role: 'user'|'ai';
text?: string;
image?: string; // base64 or preview
createdAt: number;
}


export type Chatroom = {
id: string;
title: string;
messages: Message[];
}


type ChatState = {
chatrooms: Chatroom[];
createChatroom: (title?:string) => string;
deleteChatroom: (id:string)=>void;
addMessage: (chatId:string, msg: Omit<Message,'id'|'createdAt'>)=>void;
loadOlderMessages: (chatId:string, page:number,pageSize:number)=>void;
}


const STORAGE_KEY = 'gemini_chatrooms_v1';


function loadFromStorage(): Chatroom[] {
try {
if (typeof window === 'undefined') return [];
const raw = localStorage.getItem(STORAGE_KEY);
if (!raw) return [];
return JSON.parse(raw);
} catch { return []; }
}


function saveToStorage(state: Chatroom[]) {
if (typeof window === 'undefined') return;
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


export const useChatStore = create<ChatState>((set,get) => ({
chatrooms: loadFromStorage(),
createChatroom: (title='New Chat') => {
const id = nanoid();
const room:Chatroom = { id, title, messages: [] };
set(state => { const next = [room,...state.chatrooms]; saveToStorage(next); return { chatrooms: next } });
return id;
},
deleteChatroom: (id) => {
set(state => { const next = state.chatrooms.filter(r => r.id !== id); saveToStorage(next); return { chatrooms: next } });
},
addMessage: (chatId, msg) => {
const m = { id: nanoid(), createdAt: Date.now(), ...msg } as Message;
set(state => {
const next = state.chatrooms.map(r => r.id === chatId ? { ...r, messages: [...r.messages, m] } : r);
saveToStorage(next);
}));