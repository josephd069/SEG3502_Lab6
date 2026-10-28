
const formulaire = document.getElementById('calculator-form');
const premierNombre = document.getElementById('nombre1');
const deuxiemeNombre = document.getElementById('nombre2');
const boutonsOperation = document.querySelectorAll('[data-operation]');
const boutonCalculer = document.getElementById('calculer');
const valeurResultat = document.getElementById('valeur-resultat');
const formuleResultat = document.getElementById('formule-resultat');
const messageEtat = document.getElementById('message-etat');
const cheminApi = document.getElementById('chemin-api');

let operation = 'add';

const symboles = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷'
};

const formatNombre = new Intl.NumberFormat('fr-CA', {
  maximumFractionDigits: 8
});

function normaliserNombre(texte) {
  const valeur = texte.trim().replace(',', '.');

  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(valeur)) {
    return null;
  }

  const nombre = Number(valeur);
  return Number.isFinite(nombre) ? nombre : null;
}

function afficherEtat(message, type = '') {
  messageEtat.textContent = message;
  messageEtat.className = `message-etat ${type}`.trim();
}

function actualiserApercu() {
  const a = normaliserNombre(premierNombre.value);
  const b = normaliserNombre(deuxiemeNombre.value);

  formuleResultat.textContent =
    `${premierNombre.value || '?'} ${symboles[operation]} ${deuxiemeNombre.value || '?'}`;

  cheminApi.textContent =
    `/calculator/${operation}/${a ?? '{nombre1}'}/${b ?? '{nombre2}'}`;
}

boutonsOperation.forEach(bouton => {
  bouton.addEventListener('click', () => {
    operation = bouton.dataset.operation;

    boutonsOperation.forEach(item => {
      const actif = item === bouton;
      item.classList.toggle('selectionnee', actif);
      item.setAttribute('aria-pressed', String(actif));
    });

    valeurResultat.textContent = '—';
    afficherEtat('Opération sélectionnée. Cliquez sur « Calculer le résultat ».');
    actualiserApercu();
  });
});

[premierNombre, deuxiemeNombre].forEach(champ => {
  champ.addEventListener('input', () => {
    valeurResultat.textContent = '—';
    afficherEtat('Prêt à effectuer un calcul.');
    actualiserApercu();
  });
});

formulaire.addEventListener('submit', async evenement => {
  evenement.preventDefault();

  const a = normaliserNombre(premierNombre.value);
  const b = normaliserNombre(deuxiemeNombre.value);

  if (a === null || b === null) {
    valeurResultat.textContent = '—';
    afficherEtat('Veuillez saisir deux nombres valides.', 'erreur');
    return;
  }

  if (operation === 'divide' && b === 0) {
    valeurResultat.textContent = '—';
    afficherEtat('La division par zéro est impossible.', 'erreur');
    return;
  }

  const route = `/calculator/${operation}/${a}/${b}`;
  cheminApi.textContent = route;
  boutonCalculer.disabled = true;
  afficherEtat('Calcul en cours sur le serveur…');

  try {
    const reponse = await fetch(route, {
      headers: { Accept: 'application/json' }
    });

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP ${reponse.status}`);
    }

    const resultat = Number(await reponse.text());

    if (!Number.isFinite(resultat)) {
      throw new Error('Réponse numérique invalide');
    }

    valeurResultat.textContent = formatNombre.format(resultat);
    afficherEtat('Calcul effectué avec succès par le serveur.', 'succes');

  } catch (erreur) {
    valeurResultat.textContent = '—';
    afficherEtat(
      `Impossible de récupérer le résultat (${erreur.message}).`,
      'erreur'
    );

  } finally {
    boutonCalculer.disabled = false;
  }
});

actualiserApercu();
