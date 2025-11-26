document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const bootScreen = document.getElementById('boot-screen');
    const PROMPT = 'user@portfolio:~$';

    // Window buttons
    const closeBtn = document.querySelector('.close-btn');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const maximizeBtn = document.querySelector('.maximize-btn');

    // ----------- CLI Data -----------
    const data = {
        'help': {
            description: 'Displays a list of available commands.',
            output: `
Available commands:
* <span class="info">about</span>      - Learn about me.
* <span class="info">skills</span>     - See my technical skills.
* <span class="info">projects</span>   - View a list of my work.
* <span class="info">contact</span>    - Get my contact information.
* <span class="info">theme [mode]</span> - Change theme (light | dark | cyberpunk)
* <span class="info">clear</span>      - Clears the terminal screen.
* <span class="info">echo [text]</span>- Repeat the input text.
* <span class="info">help</span>       - You're using it now!
            `
        },
        'about': {
            description: 'My background and interests.',
            output: `
Hello! I am [Your Name], a [Your Role] passionate about solving problems and building digital experiences.
            `
        },
        'skills': {
            description: 'My technical stack.',
            output: `
## Technical Skills
* **Languages:** JavaScript, Python, HTML, CSS, SQL
* **Frontend:** React, Vue.js, SASS
* **Backend:** Node.js, Express, Flask
* **Tools:** Git, Docker, Firebase, AWS
            `
        },
        'projects': {
            description: 'Key projects.',
            output: `
## Projects
* Portfolio Website
* AI Chatbot System
* Full-stack Web App
            `
        },
        'contact': {
            description: 'Contact information.',
            output: `
## Contact
📧 Email: your@email.com
🔗 GitHub: github.com/your-name
🔗 LinkedIn: linkedin.com/in/your-profile
            `
        }
    };

    // ----------- Output Print Function -----------
    function printOutput(text, isCommand = false) {
        const line = document.createElement('p');

        if (isCommand) {
            line.innerHTML = `<span id="prompt">${PROMPT}</span> ${text}`;
            line.classList.add("executed");
        } else {
            line.innerHTML = text;
        }

        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function clearTerminal() {
        output.innerHTML = '';
        printOutput(data.help.output);
    }

    // ----------- Command Handler -----------
    function handleCommand(fullCommand) {
        const parts = fullCommand.trim().toLowerCase().split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        printOutput(fullCommand, true);

        if (data[command]) {
            printOutput(data[command].output);
        }

        else if (command === 'theme') {
            const selectedTheme = args[0];
            const validThemes = ['light', 'dark', 'cyberpunk'];

            if (validThemes.includes(selectedTheme)) {
                document.body.className = selectedTheme;
                localStorage.setItem("terminal-theme", selectedTheme);
                printOutput(`Theme changed to <span class="info">${selectedTheme}</span>.`);
            } else {
                printOutput(`<span class="error">Available: light | dark | cyberpunk</span>`);
            }
        }

        else if (command === 'clear') {
            clearTerminal();
        }

else if (command === 'echo') {
    printOutput(args.join(' '));
}

else if (command === 'matrix') {
    enableMatrix();
    printOutput(`<span class="info">Matrix mode activated. Type 'exit' to return.</span>`);
}

else if (command === 'exit') {
    disableMatrix();
}

else if (command === '') {
    return;
}

else {
    printOutput(`<span class="error">Error: command not found: ${command}</span>`);
}

    }

    // ----------- Close / Minimize / Maximize Controls -----------

    function handleReopen() {
        terminal.classList.remove('hidden');
        document.getElementById('close-message')?.remove();
        document.getElementById('minimize-message')?.remove();
        input.focus();
    }

    function closeTerminal(messageText, elementId) {
        document.getElementById('close-message')?.remove();
        document.getElementById('minimize-message')?.remove();

        terminal.classList.add('hidden');

        const reopen = document.createElement('div');
        reopen.id = elementId;
        reopen.innerHTML = messageText;
        reopen.addEventListener('click', handleReopen);
        document.body.appendChild(reopen);
    }

    maximizeBtn.addEventListener('click', () => {
        terminal.classList.toggle('maximized');
        terminal.classList.remove('hidden');
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        closeTerminal('CLI Closed — Click to <span class="info">Reopen</span>', 'close-message');
    });

    minimizeBtn.addEventListener('click', () => {
        closeTerminal('CLI minimized — Click to <span class="info">Reopen</span>', 'minimize-message');
    });

    // ----------- Smooth Resize Animation -----------
    let resizeTimeout;
    new ResizeObserver(() => {
        terminal.classList.add("resizing");
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            terminal.classList.remove("resizing");
        }, 200);
    }).observe(terminal);

    // ----------- Boot Sequence -----------

    const bootLines = [
        "Initializing terminal...",
        "Loading system packages...",
        "Checking modules...",
        "Connecting to environment...",
        "✔ Boot Complete.",
        "",
        "Welcome to your CLI Portfolio!"
    ];

    let bootIndex = 0;

    // ---------------- MATRIX MODE SCRIPT ----------------
const matrixCanvas = document.getElementById("matrix");
const ctx = matrixCanvas.getContext("2d");

let matrixInterval;
let matrixRunning = false;

function enableMatrix() {
    if (matrixRunning) return;
    matrixRunning = true;

    document.body.classList.add("matrix-active");

    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const letters = "01アカサタナハマヤラワZXCVBNM+=<>|";
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }, () => 1);

    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px monospace";

        rainDrops.forEach((y, i) => {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, y * fontSize);

            if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        });
    }, 50);
}

function initialMessage() {
    printOutput(`<span class="info">Available Commands Loaded.</span>\n`);
    printOutput(data.help.output); // show commands first

    const welcome = `
Welcome to the CLI Portfolio of [Your Name]!
You can start typing commands below.
        `;
    printOutput(welcome);
}


function disableMatrix() {
    if (!matrixRunning) return;
    matrixRunning = false;

    document.body.classList.remove("matrix-active");

    clearInterval(matrixInterval);
    ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    printOutput(`<span class="error">Matrix mode disabled.</span>`);
}

// Resize matrix canvas smoothly
window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});


    function runBootSequence() {
        input.disabled = true;
        const interval = setInterval(() => {
            if (bootIndex < bootLines.length) {
                bootScreen.textContent += bootLines[bootIndex] + "\n";
                bootIndex++;
            } else {
                clearInterval(interval);
                endBootScreen();
            }
        }, 400);
    }

    function endBootScreen() {
        setTimeout(() => {
            bootScreen.classList.add("hidden");
            input.disabled = false;
            input.focus();
            initialMessage();
        }, 800);
    }

    // ----------- Load Theme + Start -----------
    const savedTheme = localStorage.getItem("terminal-theme");
    if (savedTheme) document.body.className = savedTheme;
    else document.body.className = "dark";

    // Input listener
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.value.trim());
            input.value = '';
        }
    });

    document.body.addEventListener('click', () => input.focus());

    // Startup
    runBootSequence();
});
