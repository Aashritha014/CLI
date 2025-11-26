document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const bootScreen = document.getElementById('boot-screen');
    const matrixCanvas = document.getElementById('matrix');
    const ctx = matrixCanvas.getContext("2d");
    const PROMPT = 'user@portfolio:~$';

    let matrixInterval;
    let matrixRunning = false;

    // -------- Commands Data --------
    const data = {
        help: { output: `
Available commands:
* <span class="info">about</span>      - Learn about me.
* <span class="info">skills</span>     - See my technical skills.
* <span class="info">projects</span>   - View my work.
* <span class="info">contact</span>    - Get contact details.
* <span class="info">theme [mode]</span> - light | dark | cyberpunk
* <span class="info">matrix</span>     - Enable Matrix mode
* <span class="info">exit</span>       - Disable Matrix mode
* <span class="info">clear</span>      - Clear terminal
* <span class="info">echo [text]</span>- Repeat the text
            `},
        about: { output: `Hello, I am [Your Name], a developer building cool digital experiences.` },
        skills: { output: `Languages: JS, Python, SQL\nTools: Git, Firebase, Docker\nFrameworks: React, Node.js` },
        projects: { output: `1. Portfolio Website\n2. AI Chat Assistant\n3. Full-stack SaaS App` },
        contact: { output: `📧 Email: example@email.com\n🔗 GitHub: username\n🔗 LinkedIn: profile link` }
    };


    // -------- Output Function --------
    function printOutput(text, isCommand = false) {
        const line = document.createElement('p');
        if (isCommand) line.classList.add("executed");
        line.innerHTML = isCommand ? `<span id="prompt">${PROMPT}</span> ${text}` : text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }


    // -------- Commands Handler --------
    function handleCommand(fullCommand) {
        const [cmd, ...args] = fullCommand.toLowerCase().split(" ");

        printOutput(fullCommand, true);

        if (data[cmd]) return printOutput(data[cmd].output);

        if (cmd === "theme") return changeTheme(args[0]);
        if (cmd === "clear") return clearTerminalScreen();
        if (cmd === "echo") return printOutput(args.join(" "));
        if (cmd === "matrix") return enableMatrix();
        if (cmd === "exit") return disableMatrix();

        printOutput(`<span class="error">Command not found: ${cmd}</span>`);
    }


    // -------- Theme System --------
    function changeTheme(mode) {
        const valid = ["light", "dark", "cyberpunk"];
        if (!valid.includes(mode)) return printOutput(`<span class="error">Modes: light | dark | cyberpunk</span>`);
        document.body.className = mode;
        localStorage.setItem("theme", mode);
        printOutput(`<span class="info">Theme changed to ${mode}.</span>`);
    }


    // -------- Matrix Mode --------
    function enableMatrix() {
        if (matrixRunning) return;
        matrixRunning = true;
        
        document.body.classList.add("matrix-active");

        matrixCanvas.width = innerWidth;
        matrixCanvas.height = innerHeight;
        const letters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()*&^%";
        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const rain = Array(columns).fill(1);

        matrixInterval = setInterval(() => {
            ctx.fillStyle = "rgba(0,0,0,0.06)";
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = "#00ff41";
            ctx.font = `${fontSize}px monospace`;

            rain.forEach((y, i) => {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);
                rain[i] = y * fontSize > matrixCanvas.height && Math.random() > 0.97 ? 0 : y + 1;
            });
        }, 50);

        printOutput(`<span class="info">Matrix mode ON → type "exit" to stop.</span>`);
    }

    function disableMatrix() {
        if (!matrixRunning) return;
        matrixRunning = false;
        clearInterval(matrixInterval);
        ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        document.body.classList.remove("matrix-active");
        printOutput(`<span class="error">Matrix mode disabled.</span>`);
    }


    // -------- UI Controls --------
    const closeBtn = document.querySelector(".close-btn");
    const minimizeBtn = document.querySelector(".minimize-btn");
    const maximizeBtn = document.querySelector(".maximize-btn");

    closeBtn.onclick = () => showReopenMessage("CLI Closed — Click to Reopen", "close-message");
    minimizeBtn.onclick = () => showReopenMessage("CLI Minimized — Click to Restore", "minimize-message");
    maximizeBtn.onclick = () => clearTerminalScreen(); // <-- Green button = Clear terminal


    function showReopenMessage(text, id) {
        terminal.classList.add("hidden");
        document.getElementById("close-message")?.remove();
        document.getElementById("minimize-message")?.remove();

        const msg = document.createElement("div");
        msg.id = id;
        msg.innerHTML = text;
        msg.onclick = () => {
            msg.remove();
            terminal.classList.remove("hidden");
            input.focus();
        };
        document.body.appendChild(msg);
    }


    // -------- Clear Terminal --------
    function clearTerminalScreen() {
        output.innerHTML = "";
        printOutput(`<span class="info">✔ Terminal reset.</span>`);
        printOutput(data.help.output);
    }


    // -------- Smooth Resize --------
    new ResizeObserver(() => {
        terminal.classList.add("resizing");
        setTimeout(() => terminal.classList.remove("resizing"), 200);
    }).observe(terminal);


    // -------- Boot Animation --------
    const bootLines = [
        "Initializing system...",
        "Loading modules...",
        "Connecting...",
        "✔ Ready.",
        "",
    ];

    function runBoot() {
        input.disabled = true;
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootLines.length) bootScreen.textContent += bootLines[i++] + "\n";
            else {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.add("hidden");
                    input.disabled = false;
                    clearTerminalScreen(); // show commands automatically
                    input.focus();
                }, 900);
            }
        }, 400);
    }

    // -------- Startup --------
    document.body.className = localStorage.getItem("theme") || "dark";
    runBoot();

    input.addEventListener('keydown', e => {
        if (e.key === "Enter") {
            handleCommand(input.value);
            input.value = "";
        }
    });

});
