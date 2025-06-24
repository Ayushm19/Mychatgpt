
# Chatgpt-clone

🚀 Live Demo : Open [https://mychatgpt-ayusmishra-ten.vercel.app/](https://mychatgpt-ayusmishra-ten.vercel.app/) to view the app.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then create a .env file in the root of the project and add the following environment variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=......
CLERK_SECRET_KEY=.......
SIGNING_SECRET=''

MONGODB_URI=......

OPENAI_API_KEY=......

MEM0_API_KEY=.......

CLOUDINARY_CLOUD_NAME=.......
CLOUDINARY_API_KEY=......
CLOUDINARY_API_SECRET=......

SERPAPI_API_KEY=...........

NEXT_PUBLIC_SITE_URL=http://localhost:3000  //later deployed url
```
Then, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
## Folder Structure 
```bash
CHATGPT-CLONE/
│
├── .next/
├── .vscode/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── ai/
│   │   │   │   └── route.ts
│   │   │   ├── create/
│   │   │   │   └── route.ts
│   │   │   ├── delete/
│   │   │   │   └── route.ts
│   │   │   ├── get/
│   │   │   │   └── route.ts
│   │   │   ├── rename/
│   │   │   │   └── route.ts
│   │   ├── clerk/
│   │   │   └── route.ts
│   │   └── memories/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── prism.css
│
├── assets/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── scroll-area.tsx
│   ├── ChatLabel.tsx
│   ├── Mem0Popover.tsx
│   ├── Message.tsx
│   ├── PromptBox.tsx
│   ├── SearchDialog.tsx
│   └── Sidebar.tsx
│
├── config/
│   └── db.js
│
├── context/
│   └── AppContext.tsx
│
├── lib/
│   ├── mem0Client.ts
│   ├── serpapi.ts
│   └── utils.ts
│
├── models/
│   ├── Chat.ts
│   └── User.ts
│
├── node_modules/
├── pages/
│   └── api/
│       ├── search.ts
│       └── upload.ts
│
├── public/
├── types/
│   └── global.d.ts
│
├── .env
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

```

## 🧠 Mem0 Memory Capability (`remember` keyword)

Your ChatGPT clone supports **persistent memory across chats** using the `remember` keyword.

### 🟢 How it works

* Use the keyword **`remember`** in your prompt to store facts in memory.
* These memories are accessible **across all chats** — not just the current one.
* Example workflow:

  * In **any chat**, say:
    `"Remember that my favorite food is burger."`
  * Click the **🧠 Memo button** (in the top-right corner of the chat input box).
  * You’ll now see `burger` listed as your favorite food in the memory modal.
  * In **any other chat**, ask:
    `"What's my favorite food?"`
    ✅ You’ll get the correct answer: **"Your favorite food is burger."**

### 🗂 Where it's implemented

The memory feature is implemented across the following files:

#### Frontend

* `components/Mem0Popover.tsx`
  ↳ Displays all saved memories.
* `components/PromptBox.tsx`
  ↳ Handles input parsing and memo button functionality.

#### Backend

* `app/api/chat/ai/route.ts`
  ↳ Integrates memory into the chat completion prompt.
* `lib/mem0Client.ts`
  ↳ Utility to communicate with the Mem0 API.
* `app/api/memories/route.ts`
  ↳ API endpoint to fetch stored memories for the current user.

### 🔁 Accessible Across Chats

* All saved memories are stored per user (via Clerk authentication).
* They persist across all chat sessions.
* You can recall previously stored facts in any new or existing chat.

---

Let me know if you'd like this with collapsible sections (`<details>`) or integrated directly into your existing `README.md`.

Here’s how the memory capability works visually:

![Memory Demo](https://res.cloudinary.com/dhysjuvz2/image/upload/v1750749282/dl4zfifl9avsnbq3gvks.png)




# 🚀 Features
```

🎬 Interactive landing page with animations
🌗 Dark mode / Light mode toggle
📄 Upload PDF or image and extract text using OCR
🧠 `remember` keyword to save memories across chats (powered by Mem0)
📋 File previews for uploaded PDFs and images in the chat UI
🔎 Real-time Google search results using SerpAPI directly from chat input
✍️ User can edit and copy AI messages
💻 Code block rendering with syntax highlighting
📚 Sidebar showing chat history
📝 Rename or delete individual chats
🔍 Search through previous chats by keyword
📥 Persistent memory visible via Memo button
🤖 Model selection at bottom of sidebar
👤 Clerk authentication for secure login
📱 Fully responsive layout across all devices
⚡ Fast and optimized using Vercel AI SDK with streaming
📦 File uploads stored securely on Cloudinary

---

Let me know if you want these grouped into categories (e.g. AI, UI/UX, Storage, Infra) or turned into a comparison table.
