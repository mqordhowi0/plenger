import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// GANTI DENGAN CONFIG PUNYAMU SENDIRI
const firebaseConfig = {
  apiKey: "AIzaSyB1rTusMIHIlvA5EtenknNC8qntXvtzllk",
  authDomain: "pppppp-435f1.firebaseapp.com",
  projectId: "pppppp-435f1",
  storageBucket: "pppppp-435f1.firebasestorage.app",
  messagingSenderId: "871261595085",
  appId: "1:871261595085:web:7fef50296eb62a77a45084"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCol = collection(db, "messages");

// Fungsi Kirim Pesan
const btn = document.getElementById('send-btn');
const input = document.getElementById('msg-input');

btn.onclick = async () => {
    if (input.value.trim() !== "") {
        await addDoc(messagesCol, {
            text: input.value,
            createdAt: serverTimestamp()
        });
        input.value = "";
    }
};

// Fungsi Real-time Update (Menampilkan Chat)
const q = query(messagesCol, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const msg = doc.data();
        chatBox.innerHTML += `<div class="mb-2"><b>User:</b> ${msg.text}</div>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});