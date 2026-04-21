// Intersection Observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.enterprise-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease";
        observer.observe(card);
    });

    // Quiz Logic
    initQuiz();
});

const quizData = [
    {
        question: "1. Jaký typ UTP kabelu se dříve tradičně používal pro propojení dvou stejných zařízení (např. Switch k Switchi), než se standardem stalo Auto-MDIX?",
        options: ["Straight-through (Přímý)", "Crossover (Křížený)", "Rollover (Konzolový)", "Optický (Fiber)"],
        correct: 1
    },
    {
        question: "2. Která z těchto metrik představuje skutečné množství použitelných dat z aplikací přenesených za jednotku času (bez hlaviček, chyb a režie sítě)?",
        options: ["Bandwidth (Šířka pásma)", "Throughput (Propustnost)", "Goodput (Užitečná propustnost)", "Latency (Latence)"],
        correct: 2
    },
    {
        question: "3. Jaká je primární funkce fyzické vrstvy (Layer 1) OSI modelu v Cisco sítích?",
        options: [
            "Směrování paketů podle IP adres a určení cesty k cíli.",
            "Zajištění bezchybnosti přenosu pomocí TCP protokolů.",
            "Přenášení nezpracovaných bitů (jako elektrických, optických či rádiových signálů) přes fyzické médium.",
            "Formátování dat a šifrování relací."
        ],
        correct: 2
    },
    {
        question: "4. Jaký standardizační orgán stanovuje specifikace a barevná schémata pinů pro zapojení konektorů RJ-45 (T568A a T568B)?",
        options: ["IEEE (Institute of Electrical and Electronics Engineers)", "IETF (Internet Engineering Task Force)", "TIA/EIA (Telecommunications Industry Association)", "ISO (International Organization for Standardization)"],
        correct: 2
    },
    {
        question: "5. Jak je známý standard vytvořený organizací IEEE, který specifikuje protokoly rodiny bezdrátových sítí WLAN (Wi-Fi)?",
        options: ["IEEE 802.3", "IEEE 802.11", "IEEE 802.1q", "IEEE 802.15"],
        correct: 1
    },
    {
        question: "6. Pokud propojíte infrastrukturu dvou routerů přes WAN bezprostředně přes vyhrazenou linku z jednoho města do dalšího bez sdílení, o jakou jmenovitou fyzickou topologii se typicky jedná?",
        options: ["Ring topology (Kruhová)", "Point-to-Point (Bod ke Bodu)", "Full Mesh (Plná Síť)", "Star topology (Hvězdicová)"],
        correct: 1
    },
    {
        question: "7. Které z následujících tvrzení je pravdivé o technologii Multi-mode (MMF) vůči Single-mode (SMF) optických vláknech?",
        options: [
            "Multi-mode má širší jádro, využívá typicky LED nebo VCSEL sond a slouží pro přenos na poměrně krátké vzdálenosti v rámci LAN/Data centra.",
            "Multi-mode dosahuje neuvěřitelných vzdáleností (až tisíce km) díky drahému exkluzivnímu laseru.",
            "Oba pracují shodně na principu elektrických pulzů nezávisle na jádru.",
            "Multi-mode technologie neexistuje v oblasti LAN sítí a slouží výhradně k satelitní komunikaci."
        ],
        correct: 0
    },
    {
        question: "8. Jaká ze zkratek reprezentuje standardní typy fyzických konektorů, které se typicky užívají pro zakončení OPTICKÝCH vláken (Fiber)?",
        options: ["RJ-11, RJ-45", "LC, SC, ST", "BNC, F-type", "DB-9, V.35"],
        correct: 1
    },
    {
        question: "9. Jaký je principiální inženýrský účel kódování Manchester u technologie 10Base-T (místo prosté reprezentace 1=napětí, 0=bez napětí)?",
        options: [
            "Bezpečně zašifrovat data proti odposlechu přímo na fyzické úrovni kabelu.",
            "Razantně zmenšit tloušťku kabelu využitím pouze dvou drátů místo osmi.",
            "Garantuje přechod napěťové hrany uvnitř pitu taktu, čímž zajišťuje, že odesílatel i přijímač si bez potíží vzájemně synchronizují svoje hodiny.",
            "Odstranit elektrickou indukci na lince (EMI)."
        ],
        correct: 2
    },
    {
        question: "10. Jaký bývá typický zásadní důvod (nebo naopak nevýhoda při uvažování nasazení), proč by administrátoři NEpoužili optická vlákna ke spojení úplně obyčejných koncových PC pro zaměstnance v kanceláři?",
        options: [
            "Optická vlákna nedosahují potřebných rychlostí pro moderní aplikace a jsou podstatně pomalejší než Cat6.",
            "Sklo narozdíl od mědi logicky neumí přenášet napájení PoE (Power over Ethernet) a pro nasazení do běžných PC to je ekonomický nesmysl (optické karty do PC jsou drahé).",
            "Signál uvnitř vlákna drasticky utrpí elektromagnetické rušení od zářivek na chodbách budovy.",
            "Optická vlákna lze použít výhradně venku mimo budovy; na krátké rozvody nebudou fungovat."
        ],
        correct: 1
    },
    {
        question: "11. UTP kabely (Unshielded Twisted-Pair) nedisponují stíněním. Jakým způsobem návrháři předcházejí degradaci signálu ze strany vnějšího i vnitřního rušení (crosstalk)?",
        options: [
            "Zesílením elektrického proudu a používáním velmi silných vrstev izolační gumy a PVC pro blokaci frekvencí.",
            "Umístěním softwarového šifrovače do konektorů.",
            "Využitím logického efektu rušení magnetických polí (Cancellation) a různým počtem navinutých smyček na metr u jednotlivých barevných párů kabelů.",
            "UTP kabely nedokážou předcházet rušení vůbec, a proto se nesmí nikdy používat v korporátním prostředí LAN sítí."
        ],
        correct: 2
    },
    {
        question: "12. Které dvě barvy zakončují Piny 1 a 2 na koncovce RJ-45, jestliže pro zapojení drátů v kabelu používáte standard specifikace T568B?",
        options: [
            "Zelenobílá a Zelená",
            "Oranžovobílá a Oranžová",
            "Modrá a Modrobílá",
            "Hnědá a Crossover Černá"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    const retryBtn = document.getElementById("retry-btn");
    const scoreMaxEl = document.getElementById("score-max");
    
    if (scoreMaxEl) {
        scoreMaxEl.innerText = `/${quizData.length}`;
    }

    if (quizContainer) {
        loadQuiz();
    }

    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            currentQuestion = 0;
            score = 0;
            document.getElementById("quiz-results").style.display = "none";
            document.getElementById("quiz-container").style.display = "block";
            loadQuiz();
        });
    }
}

function loadQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) return;

    if (currentQuestion >= quizData.length) {
        showResults();
        return;
    }

    const q = quizData[currentQuestion];
    
    let html = `
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
    `;
    
    q.options.forEach((opt, index) => {
        html += `<button class="quiz-option" data-index="${index}"><span style="display:inline-block; width:26px; color:var(--primary); font-weight:700;">${String.fromCharCode(65 + index)}</span> ${opt}</button>`;
    });
    
    html += `</div>`;
    quizContainer.innerHTML = html;

    const options = document.querySelectorAll(".quiz-option");
    options.forEach(opt => {
        opt.addEventListener("click", selectAnswer);
    });
}

function selectAnswer(e) {
    const button = e.currentTarget;
    const selectedIndex = parseInt(button.getAttribute("data-index"));
    const correctIndex = quizData[currentQuestion].correct;
    
    const options = document.querySelectorAll(".quiz-option");
    options.forEach(opt => {
        opt.disabled = true;
        opt.style.cursor = "default";
    });
    
    if (selectedIndex === correctIndex) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        options[correctIndex].classList.add("correct");
    }
    
    setTimeout(() => {
        currentQuestion++;
        loadQuiz();
    }, 1800);
}

function showResults() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-results").style.display = "block";
    document.getElementById("score").innerText = score;
    
    const msgEl = document.getElementById("quiz-msg");
    const max = quizData.length;
    const ratio = score / max;

    if (ratio === 1) {
        msgEl.innerText = "Naprosto perfektní! CCNA standardy jsou pevně v kapse.";
    } else if (ratio >= 0.7) {
        msgEl.innerText = "Velmi dobrá práce, jen pár drobností uniklo.";
    } else if (ratio >= 0.4) {
        msgEl.innerText = "Slušný základ, doporučujeme zopakovat standardy a topologie.";
    } else {
        msgEl.innerText = "Test selhal. Prosím, projděte si architekturu L1 znovu od základů.";
    }
}
