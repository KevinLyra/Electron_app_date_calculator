function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function removeDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

// Fonction pour ajouter des mois à une date
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    result.setDate(result.getDate() - 1);
    return result;
}


// Fonction pour formater une date
function formatDate(date) {
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction pour sauvegarder l'historique
function saveToHistory(formData, results) {
    const history = JSON.parse(localStorage.getItem('calculHistory') || '[]');
    const entry = {
        date: new Date().toISOString(),
        formData: formData,
        results: results
    };
    history.push(entry);
    localStorage.setItem('calculHistory', JSON.stringify(history));
}

// Fonction pour récupérer l'historique
function getHistory() {
    return JSON.parse(localStorage.getItem('calculHistory') || '[]');
}

 // Fonction pour afficher l'historique
 function displayHistory() {
    const history = getHistory();
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';

    history.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `
            <h3>Calcul du ${new Date(entry.date).toLocaleDateString('fr-FR')}</h3>
            <p>Formation : ${entry.formData.formationName}</p>
            <p>Date de début : ${entry.results[0]}</p>
            <p>Unité 1 : ${entry.results[1]}</p>
            <p>Unité 2 : ${entry.results[2]}</p>
            <p>Unité 3 : ${entry.results[3]}</p>
            <p>Unité 4 : ${entry.results[4]}</p>
            <p>Date de fin : ${entry.results[entry.results.length - 1]}</p>
            <button onclick="deleteHistoryEntry(${index})">Supprimer</button>
        `;
        historyContainer.appendChild(entryElement);
    });
}

// Fonction pour supprimer une entrée de l'historique
function deleteHistoryEntry(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem('calculHistory', JSON.stringify(history));
    displayHistory();
}

// Fonction pour basculer l'affichage de l'historique
function toggleHistory() {
    const historyContainer = document.getElementById('historyContainer');
    const toggleButton = document.getElementById('toggleHistory');
    
    if (historyContainer.style.display === 'none') {
        historyContainer.style.display = 'block';
        toggleButton.textContent = 'Masquer l\'historique';
        displayHistory();
    } else {
        historyContainer.style.display = 'none';
        toggleButton.textContent = 'Afficher l\'historique';
    }
}

// Fonction principale de calcul
document.getElementById('calculate-date').addEventListener('click', () => {
    const formationName = document.getElementById('formation-name').value;
    const temporalite = parseInt(document.getElementById('temporalite').value, 10);
    let startDate = new Date(document.getElementById('start-date').value);
    const unite1 = parseInt(document.getElementById('unite1').value, 10);
    const unite2 = parseInt(document.getElementById('unite2').value, 10);
    const unite3 = parseInt(document.getElementById('unite3').value, 10);
    const unite4 = parseInt(document.getElementById('unite4').value, 10);

    // Calculer la date de fin en ajoutant des mois
    let endDate = addMonths(startDate, temporalite);

    // Calculer les dates intermédiaires
    const unite1Date = addDays(startDate, unite1);
    const unite2Date = addDays(unite1Date, unite2);
    const unite3Date = addDays(unite2Date, unite3);
    const unite4Date = removeDays(endDate, unite4);

    // Vérifier si la date calculée par jours dépasse la date de fin calculée par mois
    if (unite4Date > endDate) {
        endDate = unite4Date;
    }

    const allDates = [startDate, unite1Date, unite2Date, unite3Date, unite4Date, endDate];
    const formattedDates = allDates.map(date => formatDate(date));

    // Afficher les résultats
    const resultContainer = document.getElementById('results');
    if (resultContainer) {
        resultContainer.innerHTML = ''; // Effacer les résultats précédents

        // Ajouter le nom de la formation
        const formationNameElement = document.createElement('p');
        formationNameElement.textContent = `Formation : ${formationName}`;
        resultContainer.appendChild(formationNameElement);

        // Afficher les dates
        formattedDates.forEach((date, index) => {
            const element = document.createElement('p');
            element.textContent = `Date ${index === 0 ? 'de début' : index === formattedDates.length - 1 ? 'de fin' : `unité ${index}`} : ${date}`;
            resultContainer.appendChild(element);
        });
    } else {
        console.error("L'élément 'results' n'a pas été trouvé dans le DOM");
    }

    // Sauvegarder dans l'historique
    const formData = {
        formationName,
        temporalite,
        startDate: document.getElementById('start-date').value,
        unite1,
        unite2,
        unite3,
        unite4
    };

    saveToHistory(formData, formattedDates);
    if (document.getElementById('historyContainer').style.display !== 'none') {
        displayHistory();
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = 'none'; // Cacher l'historique par défaut
    
    const toggleButton = document.getElementById('toggleHistory');
    toggleButton.addEventListener('click', toggleHistory);
});