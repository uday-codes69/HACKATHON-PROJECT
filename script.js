// Import the GoogleGenAI class from a CDN
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// --- DOM Element References ---
// Navigation
const navLinks = document.querySelectorAll('.sidebar-nav a');
const contentSections = document.querySelectorAll('.content-section');

// Playground
const queryForm = document.getElementById('queryForm');
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const responseContainer = document.getElementById('responseContainer');

// ✅ Your API key (auto-set, no input field)
const apiKey = 'AIzaSyBTFayYS5u_bqxIs8raxqWI4ncLKmvbdcs';

// --- History Logic ---

const historyList = document.getElementById('historyList'); // where history will be rendered

function saveToHistory(question, answer) {
    const item = document.createElement('div');
    item.classList.add('history-item');
    item.innerHTML = `
        <p><strong>Q:</strong> ${question}</p>
        <p><strong>A:</strong> ${answer}</p>
        <hr>
    `;
    historyList.prepend(item); // newest on top
}

// --- Navigation Logic ---
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetSectionId = link.dataset.section + '-section';
        const targetSection = document.getElementById(targetSectionId);

        navLinks.forEach(navLink => navLink.classList.remove('active-link'));
        link.classList.add('active-link');

        contentSections.forEach(section => section.classList.remove('active'));
        if (targetSection) targetSection.classList.add('active');
    });
});

// --- Form Submission Logic ---
queryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const question = userInput.value.trim();

    if (!question) {
        alert('Please enter a question for the mentor.');
        userInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Thinking...';
    loader.classList.remove('hidden');
    responseContainer.textContent = '';

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: `You are a DSA Instructor. You will only reply to questions related to Data Structures and Algorithms (DSA). 
If the user asks something unrelated, reply rudely like: "You dumb, ask me something sensible." 
Otherwise, give a clear, simple, and complete explanation as a mentor.`,
        });

        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();

        responseContainer.textContent = text;

    } catch (error) {
        console.error("API Error:", error);
        let errorMessage = "An error occurred. Check the console for details.";
        if (error.message.includes('API key not valid')) {
            errorMessage = "API Key Not Valid. Please check your key and try again.";
        }
        responseContainer.textContent = errorMessage;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Query';
        loader.classList.add('hidden');
    }
});