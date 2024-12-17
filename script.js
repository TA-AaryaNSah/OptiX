// Function to fetch commands from Google Sheets through Apps Script
async function fetchCommands() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyhbMcBp_TAtsI0KHg4aqdykqlhqro9WmRP2nO8nrvBoO41ICrz1p1X5JxgoPHKXvRRdA/exec');
    const data = await response.json();
    return data;
}

// Function to get the bot's reply
async function getBotReply(userMessage) {
    // Fetch commands from Google Sheets
    const commands = await fetchCommands();

    // Check if user input matches any command
    for (let command of commands) {
        if (userMessage.toLowerCase() === command.command.toLowerCase()) {
            return command.reply;  // Return matching reply from Google Sheet
        }
    }
    return "Sorry, I didn't quite understand that. Can you please rephrase?";  // Default reply
}

// Function to handle sending messages
async function sendMessage() {
    const userMessage = document.getElementById("userMessage").value.trim();
    const sendButton = document.getElementById("sendButton"); // Reference the send button

    if (userMessage !== "") {
        // Disable send button
        sendButton.disabled = true;

        // Display user message
        const userMessageDiv = document.createElement("div");
        userMessageDiv.classList.add("user-message");
        const userMessageText = document.createElement("div");
        userMessageText.classList.add("message-text");
        userMessageText.textContent = userMessage;
        userMessageDiv.appendChild(userMessageText);
        document.getElementById("chatBody").appendChild(userMessageDiv);

        // Show typing animation from bot
        const botTypingDiv = document.createElement("div");
        botTypingDiv.classList.add("bot-message");
        const botLogo = document.createElement("img");
        botLogo.src = "https://i.ibb.co/gV5Mcyh/naciasv.png";
        botLogo.alt = "AI Bot Logo";
        const typingMessage = document.createElement("div");
        typingMessage.classList.add("message-text", "typing");

        // Add typing dots animation
        for (let i = 0; i < 2; i++) {
            const dot = document.createElement("div");
            dot.classList.add("typing-dot");
            typingMessage.appendChild(dot);
        }

        botTypingDiv.appendChild(botLogo);
        botTypingDiv.appendChild(typingMessage);
        document.getElementById("chatBody").appendChild(botTypingDiv);

        // Wait for bot reply after 1 second (keeping typing animation visible)
        setTimeout(async () => {
            const botReply = await getBotReply(userMessage);  // Fetch bot reply based on user input

            // Display bot message with pre tag support
            const botMessageDiv = document.createElement("div");
            botMessageDiv.classList.add("bot-message");
            const botLogo = document.createElement("img");
            botLogo.src = "https://i.ibb.co/gV5Mcyh/naciasv.png";
            botLogo.alt = "AI Bot Logo";
            const botMessageText = document.createElement("div");
            botMessageText.classList.add("message-text");

            // Check if the reply contains code or multiline formatting
            if (botReply.includes('<pre>') || botReply.includes('<code>')) {
                botMessageText.innerHTML = botReply; // Render as HTML
            } else {
                botMessageText.textContent = botReply; // Simple text
            }

            botMessageDiv.appendChild(botLogo);
            botMessageDiv.appendChild(botMessageText);
            document.getElementById("chatBody").appendChild(botMessageDiv);

            // Remove typing animation
            botTypingDiv.remove();

            // Re-enable the send button
            sendButton.disabled = false;

            // Scroll to the bottom after a slight delay
            setTimeout(() => {
                document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
            }, 100); // Small delay for smoother scrolling

        }, 1000); // 1 second delay for bot's reply

        // Clear input field
        document.getElementById("userMessage").value = "";
    }
}

// Optional: Enable 'Enter' key to send message
document.getElementById("userMessage").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Function to check internet status
async function checkInternet() {
    try {
        // Try fetching a small resource to confirm connectivity
        const response = await fetch("https://www.google.com/favicon.ico", { method: "HEAD", mode: "no-cors" });
        if (response) {
            hideOfflinePopup(); // Internet is working, hide the popup
        }
    } catch (error) {
        showOfflinePopup(); // No internet, show the popup
    }
}

// Show the offline popup
function showOfflinePopup() {
    document.getElementById("offlinePopup").style.display = "flex";
}

// Hide the offline popup
function hideOfflinePopup() {
    document.getElementById("offlinePopup").style.display = "none";
}

// Monitor the online/offline events
window.addEventListener("online", hideOfflinePopup);
window.addEventListener("offline", showOfflinePopup);

// Initial check when the page loads
if (!navigator.onLine) {
    showOfflinePopup();
} else {
    checkInternet();
}