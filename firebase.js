import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 1. TEMPEL CONFIG FIREBASE KAMU DI SINI
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyB1rTusMIHIlvA5EtenknNC8qntXvtzllk",
  authDomain: "pppppp-435f1.firebaseapp.com",
  projectId: "pppppp-435f1",
  storageBucket: "pppppp-435f1.firebasestorage.app",
  messagingSenderId: "871261595085",
  appId: "1:871261595085:web:7fef50296eb62a77a45084"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCol = collection(db, "messages"); 

// ==========================================
// 2. SISTEM IDENTITAS (Biar tau mana 'Aku' mana 'Dia')
// ==========================================
let userId = localStorage.getItem("plenger_userId");
if (!userId) {
    // Kalau belum punya ID, bikin ID acak
    userId = "User-" + Math.floor(Math.random() * 10000);
    localStorage.setItem("plenger_userId", userId);
}

// ==========================================
// 3. LOGIKA KIRIM PESAN
// ==========================================
const btn = document.getElementById('send-btn');
const input = document.getElementById('msg-input');

async function sendMessage() {
    const text = input.value.trim();
    if (text !== "") {
        try {
            await addDoc(messagesCol, {
                text: text,
                sender: userId, // Kirim ID kita
                createdAt: serverTimestamp()
            });
            input.value = ""; // Kosongkan input
            input.focus();
        } catch (e) {
            console.error("Error kirim pesan: ", e);
            alert("Gagal kirim. Cek koneksi atau Rules Firebase.");
        }
    }
}

// Klik tombol kirim
btn.onclick = sendMessage;

// Tekan Enter buat kirim
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// ==========================================
// 4. LOGIKA TERIMA PESAN (REAL-TIME)
// ==========================================
const q = query(messagesCol, orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    
    // Kalau database kosong, jangan hapus pesan default "Belum ada pesan..."
    if (!snapshot.empty) {
        chatBox.innerHTML = ""; // Bersihkan layar
    }

    snapshot.forEach((doc) => {
        const msg = doc.data();
        
        // Cek apakah pesan ini dari KITA sendiri?
        const isMe = msg.sender === userId;
        
        // Style KITA (Kanan, Ungu) vs ORANG LAIN (Kiri, Putih Transparan)
        const alignClass = isMe ? 'items-end' : 'items-start';
        const bubbleClass = isMe 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white/20 text-gray-100 rounded-bl-none border border-white/10';
        const labelName = isMe ? 'Me' : 'Teman';

        // Template Bubble Chat
        const msgHTML = `
            <div class="flex flex-col ${alignClass} mb-3 animate__animated animate__fadeInUp animate__faster">
                <span class="text-[10px] text-white/50 mb-1 px-1">${labelName}</span>
                <div class="px-4 py-2 rounded-2xl ${bubbleClass} shadow-sm max-w-[85%] break-words text-sm leading-relaxed">
                    ${msg.text}
                </div>
            </div>
        `;
        
        chatBox.insertAdjacentHTML('beforeend', msgHTML);
    });

    // Auto scroll ke paling bawah setiap ada pesan baru
    chatBox.scrollTop = chatBox.scrollHeight;
});