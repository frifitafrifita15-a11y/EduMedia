/* =====================================================
   EduMedia v2 – script.js
   1) Données  2) Utilitaires  3) Compte & progression
   4) Pages    5) Thème        6) Routeur
   ===================================================== */

/* ---------- 1. DONNÉES : 3 matières, 2 cours, 1 quiz (4 questions) ---------- */
const MATIERES = [
  { id: "reseaux", nom: "Réseaux", image: "reseaux.svg", description: "Modèle OSI, adressage IP, protocoles.",
    cours: [
      { id: "r1", titre: "Le modèle OSI", duree: 10, texte: [
          "Le modèle OSI découpe la communication réseau en 7 couches : physique, liaison, réseau, transport, session, présentation, application.",
          "Chaque couche rend un service à la couche supérieure. Le routage (adresses IP) se fait en couche 3, le transport fiable (TCP) en couche 4."],
        code: "ping 192.168.1.1      # teste la couche réseau (ICMP)\ntraceroute google.com # affiche les routeurs traversés" },
      { id: "r2", titre: "Adressage IPv4 et masque", duree: 12, texte: [
          "Une adresse IPv4 est composée de 32 bits, écrits en 4 octets. Le masque indique quelle partie désigne le réseau et laquelle désigne la machine.",
          "Avec /24, les 24 premiers bits identifient le réseau : il reste 8 bits pour les machines, soit 254 hôtes utilisables."],
        code: "Adresse : 192.168.1.10/24\nMasque  : 255.255.255.0\nRéseau  : 192.168.1.0\nBroadcast : 192.168.1.255" } ],
    quiz: [
      { q: "Quelle couche OSI gère le routage IP ?", choix: ["Liaison", "Réseau", "Transport"], rep: 1, expl: "Les routeurs travaillent en couche 3 : la couche réseau." },
      { q: "Combien de couches compte le modèle OSI ?", choix: ["4", "5", "7"], rep: 2, expl: "Le modèle OSI en compte 7 (TCP/IP en compte 4)." },
      { q: "Masque équivalent à /24 ?", choix: ["255.255.0.0", "255.255.255.0", "255.0.0.0"], rep: 1, expl: "24 bits à 1 = 255.255.255.0." },
      { q: "Quel protocole assure un transport fiable ?", choix: ["UDP", "ICMP", "TCP"], rep: 2, expl: "TCP établit une connexion et retransmet les paquets perdus." } ] },

  { id: "systemes", nom: "Systèmes Linux", image: "systemes.svg", description: "Commandes, fichiers, processus, droits.",
    cours: [
      { id: "s1", titre: "Commandes Linux de base", duree: 8, texte: [
          "Le terminal permet de piloter le système avec des commandes. Savoir naviguer et manipuler des fichiers est la base de tout administrateur.",
          "Chaque commande accepte des options : par exemple ls -l affiche les détails (droits, taille, date)."],
        code: "pwd            # affiche le dossier courant\nls -l          # liste détaillée\ncd /etc        # change de dossier\nmkdir projet   # crée un dossier" },
      { id: "s2", titre: "Processus et permissions", duree: 12, texte: [
          "Un processus est un programme en cours d'exécution. On peut les lister avec ps et en arrêter un avec kill.",
          "Les droits se notent r (lire = 4), w (écrire = 2), x (exécuter = 1), pour le propriétaire, le groupe et les autres."],
        code: "ps aux | grep nginx\nkill 1234\nchmod 755 script.sh   # rwxr-xr-x" } ],
    quiz: [
      { q: "Quelle commande affiche le dossier courant ?", choix: ["pwd", "cd", "mv"], rep: 0, expl: "pwd = print working directory." },
      { q: "chmod 755 donne les droits…", choix: ["rw-r--r--", "rwxr-xr-x", "rwxrwxrwx"], rep: 1, expl: "7 = rwx, 5 = r-x, 5 = r-x." },
      { q: "Quelle commande arrête un processus ?", choix: ["stop", "kill", "end"], rep: 1, expl: "kill envoie un signal au processus (par son PID)." },
      { q: "Quelle valeur vaut le droit « écrire » ?", choix: ["1", "2", "4"], rep: 1, expl: "r = 4, w = 2, x = 1." } ] },

  { id: "web", nom: "Développement web", image: "web.svg", description: "HTML, CSS, JavaScript et HTTP.",
    cours: [
      { id: "w1", titre: "HTML et CSS", duree: 10, texte: [
          "HTML décrit la structure d'une page avec des balises. CSS décrit son apparence : couleurs, polices, mise en page.",
          "Avec les media queries, une même page s'adapte au mobile et à l'ordinateur (design responsive)."],
        code: "<h1 class=\"titre\">Bonjour</h1>\n\n.titre { color: #1b2a6b; }\n@media (max-width: 700px) { .titre { font-size: 1.2rem; } }" },
      { id: "w2", titre: "JavaScript et le DOM", duree: 15, texte: [
          "JavaScript rend la page interactive en modifiant le DOM, l'arbre des éléments HTML.",
          "On sélectionne un élément, puis on écoute un événement (clic, saisie…) pour réagir."],
        code: "const bouton = document.querySelector('#ok');\nbouton.addEventListener('click', () => {\n  alert('Bravo !');\n});" } ],
    quiz: [
      { q: "Que signifie le code HTTP 404 ?", choix: ["Erreur serveur", "Page introuvable", "Succès"], rep: 1, expl: "404 = ressource introuvable. 200 = succès, 500 = erreur serveur." },
      { q: "Quel langage gère l'apparence d'une page ?", choix: ["CSS", "HTML", "SQL"], rep: 0, expl: "CSS = Cascading Style Sheets." },
      { q: "Quelle méthode sélectionne un élément du DOM ?", choix: ["getValue()", "querySelector()", "selectNode()"], rep: 1, expl: "querySelector() accepte un sélecteur CSS." },
      { q: "Quelle méthode HTTP sert à lire une ressource ?", choix: ["GET", "POST", "PUT"], rep: 0, expl: "GET lit, POST envoie des données, PUT remplace." } ] }
];
const TOUS = MATIERES.flatMap(m => m.cours.map(c => ({ m, c })));   // liste à plat des cours

/* ---------- 2. UTILITAIRES ---------- */
const app = document.querySelector("#app");
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lire = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const ecrire = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const mat = id => MATIERES.find(m => m.id === id);
let minuterie = null;                                               // chrono du quiz

/* ---------- 3. COMPTE & PROGRESSION ---------- */
const utilisateur = () => lire("edu_session", null);
const cleProg = () => "edu_prog_" + (utilisateur()?.email ?? "invite"); // sans compte : profil « invité »
const prog = () => lire(cleProg(), { faits: [], favoris: [], scores: {} });
const basculer = (tab, id) => { const i = tab.indexOf(id); i < 0 ? tab.push(id) : tab.splice(i, 1); return i < 0; };
const pctGlobal = p => Math.round(p.faits.length / TOUS.length * 100);
// Badges débloqués selon la progression
const badges = p => [
  ["Premier cours", p.faits.length >= 1],
  ["Collectionneur", p.favoris.length >= 1],
  ["Quiz parfait", Object.values(p.scores).some(a => a.some(t => t.score === t.total))],
  ["Parcours complet", p.faits.length === TOUS.length]
];
function majLienAuth() {
  const u = utilisateur(), l = document.querySelector("#authLink");
  l.textContent = u ? "Déconnexion (" + u.nom + ")" : "Connexion";
  l.href = u ? "#/deconnexion" : "#/connexion";
}

/* ---------- 4. PAGES ---------- */
const lienCarte = (href, contenu, extra = "") => `<a class="carte lien" href="${href}" ${extra}>${contenu}</a>`;

function pageAccueil() {
  const p = prog();
  app.innerHTML = `
    <section class="hero">
      <div>
        <h1>Réseaux, systèmes, web : tout votre parcours au même endroit.</h1>
        <p>Cours, vidéos, audio, animations et quiz chronométrés. Vos progrès sont enregistrés.</p>
        <a class="btn jaune" href="#/matieres">Commencer à réviser</a>
        <a class="btn clair" href="#/connexion">Créer un compte</a>
      </div>
      <img src="accueil.svg" alt="Illustration d'un lecteur vidéo">
    </section>
    <ul class="avantages">
      <li><b>${MATIERES.length} matières</b><br>${TOUS.length} cours, ${MATIERES.length} quiz</li>
      <li><b>${pctGlobal(p)} %</b><br>de votre parcours terminé</li>
      <li><b>${p.favoris.length} favori(s)</b><br>à retrouver dans « Progression »</li>
    </ul>`;
}

function pageAuth(mode) {
  const ins = mode === "inscription";
  app.innerHTML = `
    <form class="carte" id="formAuth">
      <h2>${ins ? "Créer un compte" : "Se connecter"}</h2>
      ${ins ? '<label for="nom">Prénom</label><input type="text" id="nom" required>' : ""}
      <label for="email">E-mail</label><input type="email" id="email" required>
      <label for="mdp">Mot de passe (6 caractères min.)</label><input type="password" id="mdp" minlength="6" required>
      <p class="msg err" id="msg" role="alert"></p>
      <button class="btn" type="submit">${ins ? "S'inscrire" : "Se connecter"}</button>
      <p><a href="#/${ins ? "connexion" : "inscription"}">${ins ? "J'ai déjà un compte" : "Pas de compte ? S'inscrire"}</a></p>
    </form>`;
  document.querySelector("#formAuth").onsubmit = e => {
    e.preventDefault();
    const email = document.querySelector("#email").value.trim().toLowerCase(), mdp = document.querySelector("#mdp").value;
    const comptes = lire("edu_comptes", {}), msg = document.querySelector("#msg");
    if (ins) {
      if (comptes[email]) return void (msg.textContent = "Cet e-mail est déjà utilisé.");
      comptes[email] = { nom: document.querySelector("#nom").value.trim(), mdp }; ecrire("edu_comptes", comptes);
    } else if (!comptes[email] || comptes[email].mdp !== mdp) return void (msg.textContent = "E-mail ou mot de passe incorrect.");
    ecrire("edu_session", { email, nom: comptes[email].nom });
    location.hash = "#/matieres";
  };
}

function pageMatieres() {
  const p = prog();
  app.innerHTML = `<h2>Choisissez une matière</h2><div class="grille">` + MATIERES.map(m => {
    const faits = m.cours.filter(c => p.faits.includes(c.id)).length;
    return lienCarte("#/matiere/" + m.id, `<img src="${m.image}" alt="Illustration ${m.nom}"><h3>${m.nom}</h3><p>${m.description}</p>
      <span class="puce">${faits}/${m.cours.length} cours terminés</span>`);
  }).join("") + `</div>`;
}

function pageMatiere(id) {
  const m = mat(id); if (!m) return page404();
  const p = prog();
  app.innerHTML = `<p class="fil"><a href="#/matieres">Matières</a> / ${m.nom}</p><h2>${m.nom}</h2><div class="grille">` +
    m.cours.map(c => lienCarte("#/cours/" + c.id, `<h3>${p.faits.includes(c.id) ? "✓ " : ""}${c.titre}</h3><p>${c.texte[0].slice(0, 90)}…</p>
      <span class="puce">${c.duree} min</span>`)).join("") +
    lienCarte("#/quiz/" + m.id, `<h3>Quiz chronométré</h3><p>${m.quiz.length} questions, 20 s chacune, avec correction.</p><span class="puce">Meilleur : ${
      p.scores[m.id] ? Math.max(...p.scores[m.id].map(t => t.score)) + "/" + m.quiz.length : "pas encore passé"}</span>`, 'style="border:2px solid var(--soleil)"') + `</div>`;
}

function pageCours(id) {
  const i = TOUS.findIndex(x => x.c.id === id); if (i < 0) return page404();
  const { m, c } = TOUS[i], p = prog();
  const prec = TOUS[i - 1], suiv = TOUS[i + 1];
  app.innerHTML = `
    <p class="fil"><a href="#/matieres">Matières</a> / <a href="#/matiere/${m.id}">${m.nom}</a> / ${c.titre}</p>
    <div class="entete-cours"><h2>${c.titre}</h2>
      <button class="btn clair" id="btnFav" aria-pressed="${p.favoris.includes(c.id)}">${p.favoris.includes(c.id) ? "★ Favori" : "☆ Ajouter aux favoris"}</button></div>
    <div class="onglets" role="tablist">
      ${["Cours", "Vidéo", "Audio", "Animation"].map((t, k) => `<button role="tab" class="${k ? "" : "actif"}" data-tab="${k}">${t}</button>`).join("")}
    </div>
    <section class="carte panneau" data-panneau="0">
      ${c.texte.map(t => `<p>${t}</p>`).join("")}
      <pre><code>${esc(c.code)}</code></pre>
      <img src="${m.image}" alt="Schéma de ${m.nom}" style="max-height:220px">
    </section>
    <section class="carte panneau" data-panneau="1" hidden><video controls preload="metadata" poster="${m.image}" src="tutoriel.mp4">Vidéo non supportée.</video></section>
    <section class="carte panneau" data-panneau="2" hidden><p>Écoutez l'explication du cours :</p><audio controls preload="none" src="audio/explication.wav"></audio></section>
    <section class="carte panneau" data-panneau="3" hidden>
      <p>Animation : un paquet circule entre deux machines.</p>
      <div class="liaison" id="liaison"><i>PC</i><span class="paquet"></span><i>Serveur</i></div>
      <button class="btn clair" id="btnAnim">Pause</button>
    </section>
    <div class="actions">
      <button class="btn" id="btnFait">${p.faits.includes(c.id) ? "✓ Cours terminé" : "Marquer comme terminé"}</button>
      ${prec ? `<a class="btn clair" href="#/cours/${prec.c.id}">← Précédent</a>` : ""}
      ${suiv ? `<a class="btn clair" href="#/cours/${suiv.c.id}">Suivant →</a>` : ""}
      <a class="btn jaune" href="#/quiz/${m.id}">Quiz</a>
    </div>`;

  // Onglets : on affiche un seul panneau à la fois
  const onglets = app.querySelectorAll("[data-tab]");
  onglets.forEach(b => b.onclick = () => {
    onglets.forEach(o => o.classList.toggle("actif", o === b));
    app.querySelectorAll("[data-panneau]").forEach(s => s.hidden = s.dataset.panneau !== b.dataset.tab);
  });
  // Favori et « terminé » : enregistrés dans le profil
  document.querySelector("#btnFav").onclick = () => { const q = prog(); const on = basculer(q.favoris, c.id); ecrire(cleProg(), q); pageCours(id); };
  document.querySelector("#btnFait").onclick = () => { const q = prog(); basculer(q.faits, c.id); ecrire(cleProg(), q); pageCours(id); };
  document.querySelector("#btnAnim").onclick = e => {
    const pause = document.querySelector("#liaison").classList.toggle("pause");
    e.target.textContent = pause ? "Reprendre" : "Pause";
  };
}

/* Quiz : une question à la fois, chrono de 20 s, explication, score enregistré */
function pageQuiz(id) {
  const m = mat(id); if (!m) return page404();
  let i = 0, score = 0;
  const TEMPS = 20;

  function question() {
    const q = m.quiz[i]; let reste = TEMPS;
    app.innerHTML = `
      <p class="fil"><a href="#/matiere/${m.id}">${m.nom}</a> / Quiz</p>
      <div class="carte"><div class="barre"><i style="width:${i / m.quiz.length * 100}%"></i></div>
        <p>Question ${i + 1} / ${m.quiz.length} · <b id="chrono">${reste} s</b></p>
        <h3>${q.q}</h3>
        ${q.choix.map((c, j) => `<button class="choix" data-j="${j}">${c}</button>`).join("")}
        <p class="msg" id="expl" role="status"></p><div id="suite"></div></div>`;
    app.querySelectorAll(".choix").forEach(b => b.onclick = () => repondre(+b.dataset.j));
    clearInterval(minuterie);
    minuterie = setInterval(() => {                       // décompte : à 0, la réponse est comptée fausse
      document.querySelector("#chrono").textContent = --reste + " s";
      if (reste <= 0) repondre(-1);
    }, 1000);
  }
  function repondre(j) {
    clearInterval(minuterie);
    const q = m.quiz[i], boutons = app.querySelectorAll(".choix");
    boutons.forEach(b => b.disabled = true);
    boutons[q.rep].classList.add("bon");
    if (j === q.rep) score++; else if (j >= 0) boutons[j].classList.add("mauvais");
    const expl = document.querySelector("#expl");
    expl.className = "msg " + (j === q.rep ? "ok" : "err");
    expl.textContent = (j === q.rep ? "Bonne réponse. " : j < 0 ? "Temps écoulé. " : "Raté. ") + q.expl;
    const dernier = i === m.quiz.length - 1;
    document.querySelector("#suite").innerHTML = `<button class="btn" id="btnSuite">${dernier ? "Voir mon résultat" : "Question suivante"}</button>`;
    document.querySelector("#btnSuite").onclick = () => { if (dernier) fin(); else { i++; question(); } };
  }
  function fin() {
    const p = prog(); (p.scores[m.id] ??= []).push({ score, total: m.quiz.length, date: new Date().toLocaleDateString("fr-FR") });
    ecrire(cleProg(), p);
    app.innerHTML = `<div class="carte" style="text-align:center"><h2>Score : ${score} / ${m.quiz.length}</h2>
      <p>${score === m.quiz.length ? "Parfait ! Badge « Quiz parfait » débloqué." : score >= 2 ? "Bon travail, continuez." : "Relisez les cours puis réessayez."}</p>
      <a class="btn" href="#/quiz/${m.id}">Réessayer</a> <a class="btn clair" href="#/progression">Voir ma progression</a></div>`;
  }
  question();
}

function pageRecherche() {
  app.innerHTML = `<h2>Rechercher un cours</h2>
    <div class="filtres"><input type="search" id="champ" placeholder="Ex. : TCP, chmod, DOM…" aria-label="Rechercher">
      <select id="filtre" aria-label="Matière"><option value="">Toutes les matières</option>${MATIERES.map(m => `<option value="${m.id}">${m.nom}</option>`).join("")}</select>
      <label class="inline"><input type="checkbox" id="favSeul"> Favoris</label></div>
    <div class="grille" id="resultats"></div>`;
  const champ = document.querySelector("#champ"), zone = document.querySelector("#resultats");
  function filtrer() {
    const mot = champ.value.trim().toLowerCase(), p = prog();
    const r = TOUS.filter(({ m, c }) =>
      (!filtre.value || m.id === filtre.value) && (!favSeul.checked || p.favoris.includes(c.id)) &&
      (c.titre + c.texte.join(" ") + c.code + m.nom).toLowerCase().includes(mot));
    zone.innerHTML = r.length ? r.map(({ m, c }) => lienCarte("#/cours/" + c.id,
      `<span class="puce">${m.nom}</span><h3>${c.titre}</h3><p>${c.texte[0].slice(0, 80)}…</p>`)).join("")
      : `<p>Aucun résultat pour « ${esc(mot)} ». Essayez un autre mot-clé.</p>`;
  }
  [champ, filtre, favSeul].forEach(el => el.oninput = filtrer);
  filtrer();
}

function pageProgression() {
  const p = prog(), u = utilisateur();
  const favoris = TOUS.filter(({ c }) => p.favoris.includes(c.id));
  app.innerHTML = `
    <h2>${u ? "Bonjour " + esc(u.nom) : "Profil invité"} : ${pctGlobal(p)} % du parcours terminé</h2>
    ${u ? "" : '<p class="msg">Connectez-vous pour conserver vos progrès sur votre compte.</p>'}
    <div class="barre grande"><i style="width:${pctGlobal(p)}%"></i></div>
    <h3>Badges</h3><p>${badges(p).map(([n, ok]) => `<span class="puce badge ${ok ? "" : "verrou"}">${ok ? "★" : "🔒"} ${n}</span>`).join(" ")}</p>
    <div class="grille">` + MATIERES.map(m => {
      const faits = m.cours.filter(c => p.faits.includes(c.id)).length, essais = p.scores[m.id] ?? [];
      const barres = essais.slice(-6).map((t, k) => `<rect x="${k * 28}" y="${50 - t.score / t.total * 50}" width="20" height="${t.score / t.total * 50}" rx="3"><title>${t.date} : ${t.score}/${t.total}</title></rect>`).join("");
      return `<div class="carte"><h3>${m.nom}</h3><p>Cours terminés : ${faits} / ${m.cours.length}</p>
        <div class="barre"><i style="width:${faits / m.cours.length * 100}%"></i></div>
        <p>Historique des quiz (${essais.length} essai(s))</p>
        ${essais.length ? `<svg class="graph" viewBox="0 0 170 52" role="img" aria-label="Scores récents">${barres}</svg>` : "<p>Aucun quiz passé.</p>"}</div>`;
    }).join("") + `</div>
    <h3>Mes favoris</h3>${favoris.length ? `<div class="grille">${favoris.map(({ m, c }) => lienCarte("#/cours/" + c.id, `<span class="puce">${m.nom}</span><h3>${c.titre}</h3>`)).join("")}</div>` : "<p>Aucun favori. Ouvrez un cours et cliquez sur ☆.</p>"}
    <p class="actions"><button class="btn clair" id="btnExport">Exporter (JSON)</button> <button class="btn clair" id="btnReset">Réinitialiser</button></p>`;
  document.querySelector("#btnExport").onclick = () => {          // téléchargement du profil en JSON
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }));
    a.download = "progression-edumedia.json"; a.click();
  };
  document.querySelector("#btnReset").onclick = () => { if (confirm("Effacer toute votre progression ?")) { localStorage.removeItem(cleProg()); pageProgression(); } };
}

const page404 = () => app.innerHTML = `<div class="carte"><h2>Page introuvable</h2><a class="btn" href="#/accueil">Retour à l'accueil</a></div>`;

/* ---------- 5. THÈME CLAIR / SOMBRE (mémorisé) ---------- */
function appliquerTheme(t) {
  document.documentElement.dataset.theme = t;
  document.querySelector("#themeBtn").textContent = t === "dark" ? "☀ Clair" : "☾ Sombre";
  localStorage.setItem("edu_theme", t);
}
document.querySelector("#themeBtn").onclick = () => appliquerTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
appliquerTheme(localStorage.getItem("edu_theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

/* ---------- 6. ROUTEUR : #/page/paramètre ---------- */
function routeur() {
  clearInterval(minuterie);                                         // arrête le chrono si on quitte un quiz
  const [, page = "accueil", param] = location.hash.split("/");
  if (page === "deconnexion") { localStorage.removeItem("edu_session"); location.hash = "#/accueil"; return; }
  const pages = { accueil: pageAccueil, connexion: () => pageAuth("connexion"), inscription: () => pageAuth("inscription"),
    matieres: pageMatieres, matiere: () => pageMatiere(param), cours: () => pageCours(param), quiz: () => pageQuiz(param),
    recherche: pageRecherche, progression: pageProgression };
  (pages[page] || page404)();
  majLienAuth(); window.scrollTo(0, 0);
}
window.addEventListener("hashchange", routeur);
routeur();
