import type { ProjectDetailBodyProps } from "@/pages/projects/types";

const DEMO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Codebusters Practice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f9f9f9;
    }

    .label {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .word-group {
      display: flex;
      flex-direction: row;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: nowrap;
    }

    .char-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .char-box {
      width: 35px;
      height: 35px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #333;
      text-transform: uppercase;
      box-sizing: border-box;
    }

    .readonly {
      background: #ddd;
    }

    .space-box {
      background: #eee;
      border: 1px solid #ccc;
      pointer-events: none;
    }

    .punct-box {
      background: #f2f2f2;
      pointer-events: none;
    }

    .button-container {
      margin-top: 20px;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
    }

    .flex-wrap-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-start;
    }

    .char-box:focus {
      outline: 2px solid gold;
      background-color: #fffbe6;
    }
  </style>
</head>
<body>

  <div class="label" id="questionLabel"></div>
  <div class="flex-wrap-container" id="gridContainer"></div>
  <div id="frequencyTableContainer" style="margin-top: 30px;"></div>
  <div class="button-container">
    <button onclick="checkAnswer()">Check Answer</button>
  </div>
  <div id="resultMessage" style="margin-top: 10px; font-weight: bold;"></div>

  <script>
    const defaultData = {
      cipherType: "Aristocrat",
      aristoType: "K1", // Change to "K1" or "K2" here to switch types manually
      questionText: "[273] Solve this quote about a certain aquatic animal encoded as an Aristocrat.",
      cipherText: "IVM UJZGPQ UGHV XSMHP'I EMRJJZ MYGHI, TMSTJM HSKMIGKMH IVESA IVMK GP IVM HBZ LOI IVMZ RJARZH URJJ XSAP.",
      correctAnswer: "The flying fish doesn't really exist, people sometimes throw them in the sky but they always fall down.",
      revealKeyword: "BLOBFISH"
    };

    let answerInputs = [];
    let keywordInputs = [];
    let kInputs = [];

    const buildPage = () => {
      document.getElementById("questionLabel").innerText = defaultData.questionText;
      const container = document.getElementById("gridContainer");
      container.innerHTML = '';
      answerInputs = [];
      keywordInputs = [];
      kInputs = [];

      const showKeyword = ["Porta", "Hill", "Nihilist", "Checkerboard"].includes(defaultData.cipherType);
      const words = defaultData.cipherText.trim().split(" ");

      words.forEach(word => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word-group";

        for (let i = 0; i < word.length; i++) {
          const ch = word[i];
          const charGroup = document.createElement("div");
          charGroup.className = "char-group";

          if (showKeyword) {
            const kwBox = createBox('', true, false);
            keywordInputs.push(kwBox);
            charGroup.appendChild(kwBox);
          }

          const cipherBox = createBox(ch, false, false, true);
          charGroup.appendChild(cipherBox);

          if (/^[.,;:'!?]$/.test(ch)) {
            const punctBox = createBox(ch, false, false, true);
            punctBox.classList.add('punct-box');
            punctBox.tabIndex = -1;
            charGroup.appendChild(punctBox);
          } else {
            const answerBox = createBox('', true, false);
            answerInputs.push(answerBox);
            charGroup.appendChild(answerBox);
          }

          wordDiv.appendChild(charGroup);
        }

        const spaceGroup = document.createElement("div");
        spaceGroup.className = "char-group";
        if (showKeyword) spaceGroup.appendChild(createBox(' ', false, true));
        spaceGroup.appendChild(createBox(' ', false, true));
        spaceGroup.appendChild(createBox(' ', false, true));
        wordDiv.appendChild(spaceGroup);

        container.appendChild(wordDiv);
      });

      addCursorLogic(answerInputs);
      addCursorLogic(keywordInputs);
      addCursorLogic(kInputs);

      if (defaultData.cipherType === "Aristocrat") {
        showFrequencyTable(defaultData.cipherText);
      }
    };

    const createBox = (ch, editable = false, isSpace = false, readonly = false) => {
      const input = document.createElement('input');
      input.className = 'char-box';

      if (isSpace || ch === ' ') {
        input.value = ' ';
        input.readOnly = true;
        input.tabIndex = -1;
        input.classList.add('space-box');
      } else if (readonly || /^[.,;:'!?]$/.test(ch)) {
        input.value = ch.toUpperCase();
        input.readOnly = true;
        input.tabIndex = -1;
        input.classList.add('readonly');
        if (/^[.,;:'!?]$/.test(ch)) input.classList.add('punct-box');
      } else if (editable) {
        input.maxLength = 1;
        input.value = '';
      }

      return input;
    };

    const addCursorLogic = (inputList) => {
      inputList.forEach((input, idx) => {
        input.addEventListener('beforeinput', (e) => {
          if (e.inputType === 'insertText' && e.data) {
            e.preventDefault();
            input.value = e.data.toUpperCase();
            let next = idx + 1;
            while (next < inputList.length && inputList[next].readOnly) next++;
            if (next < inputList.length) inputList[next].focus();
          }
        });

        // Backspace: clear and move forward
    input.addEventListener('keydown', (e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        input.value = '';
        if (idx + 1 < inputList.length) {
          inputList[idx + 1].focus();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        let prev = idx - 1;
        while (prev >= 0 && inputList[prev].classList.contains("space-box")) prev--;
        if (prev >= 0) inputList[prev].focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        let next = idx + 1;
        while (next < inputList.length && inputList[next].classList.contains("space-box")) next++;
        if (next < inputList.length) inputList[next].focus();
      }
    });

      });
    };

    const checkAnswer = () => {
      const userAnswer = Array.from(document.querySelectorAll(".char-group"))
        .map(group => {
          const input = group.children[group.children.length - 1];
          return input.value.toUpperCase().trim();
        }).join('');

      const correct = defaultData.correctAnswer.toUpperCase().replace(/\s+/g, '');

      const resultDiv = document.getElementById("resultMessage");
      if (userAnswer === correct) {
        resultDiv.style.color = "green";
        resultDiv.textContent = \`✅ Correct! Keyword: $\{defaultData.revealKeyword}\`;
      } else {
        resultDiv.style.color = "red";
        resultDiv.textContent = "❌ Incorrect. Try again.";
      }
    };

    const showFrequencyTable = (cipherText) => {
      const freq = {};
      for (let i = 0; i < 26; i++) {
        freq[String.fromCharCode(65 + i)] = 0;
      }

      for (const ch of cipherText.toUpperCase()) {
        if (ch >= 'A' && ch <= 'Z') {
          freq[ch]++;
        }
      }

      const aristoType = defaultData.aristoType;
      const container = document.getElementById("frequencyTableContainer");
      container.innerHTML = '';

      const table = document.createElement("table");
      table.style.cssText = "border-collapse: collapse; width: 100%; text-align: center;";

      const headerRow = document.createElement("tr");
      Object.keys(freq).forEach(ch => {
        const th = document.createElement("th");
        th.style.cssText = "border: 1px solid #333; padding: 4px; background: #ccc;";
        th.textContent = ch;
        headerRow.appendChild(th);
      });

      const countRow = document.createElement("tr");
      Object.values(freq).forEach(count => {
        const td = document.createElement("td");
        td.style.cssText = "border: 1px solid #333; padding: 4px;";
        td.textContent = count;
        countRow.appendChild(td);
      });

      let kRow = document.createElement("tr");
      Object.keys(freq).forEach(() => {
        const td = document.createElement("td");
        td.style.cssText = "border: 1px solid #333; padding: 4px; background: #eef;";
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.style.cssText = "width: 25px; text-align: center; text-transform: uppercase;";
        kInputs.push(input);
        td.appendChild(input);
        kRow.appendChild(td);
      });

      if (aristoType === "K1") {
        table.appendChild(headerRow);
        table.appendChild(countRow);
        table.appendChild(kRow);
      } else if (aristoType === "K2") {
        table.appendChild(kRow);
        table.appendChild(headerRow);
        table.appendChild(countRow);
      } else {
        table.appendChild(headerRow);
        table.appendChild(countRow);
      }

      container.appendChild(table);
      addCursorLogic(kInputs);
    };

    window.addEventListener("DOMContentLoaded", buildPage);
    window.addEventListener("resize", buildPage);
  </script>
</body>
</html>`;

export function ScioVirtualCodebustersDeepDive({ project }: ProjectDetailBodyProps) {
  return (
    <div className="space-y-6">
      <section className="card-surface p-7">
        <p className="section-label mb-3">Embedded demo</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          This is an example of an Aristocrat cipher solving assistant that was used for this course. The code allows the user to input their response to the question in parts as they go, not mandating any specific order. Similar assistants were built for other ciphers as well and packaged into a single website that students could access at any time.
        </p>

        <div className="rounded-2xl overflow-hidden border border-border bg-secondary/30">
          <iframe
            title="ScioVirtual Codebusters embedded demo"
            srcDoc={DEMO_HTML}
            sandbox="allow-scripts"
            className="w-full h-[520px] bg-transparent"
          />
        </div>
      </section>

      <section className="card-surface p-7">
        <p className="section-label mb-3">How it works</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Instant feedback loop</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The core UX allows the user to check their response at any time, and provides immediate feedback on whether their response is correct or not. When correct, the platform reveals a keyword to the user to verify completion, saving instructors the need to manually check each response.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Problem scaffolding</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each puzzle can expose structured affordances (frequency tables, substitution mapping grids, known-word
              slots) that mirror information that students would have access to with the physical versino of the questions.
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface p-7">
        <p className="section-label mb-3">Key contributions</p>
        <ul className="space-y-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
              <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

