const select = document.getElementById("ville");
const resultat = document.getElementById("resultat");

select.addEventListener("change", () => {
  const ville = select.value;
  if (!ville) {
    return;
  }
  else {
    afficherMeteo(ville);
  }
});

async function afficherMeteo(ville) {

  let url;

  if (ville == 'merignac') {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=44.8422361&lon=-0.6469599&appid=6d82a7f4ef9b59dbaae0aadd35bd679a`;
  }
  else if (ville == 'saintgeours') {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=43.6879086&lon=-1.2379292&appid=6d82a7f4ef9b59dbaae0aadd35bd679a`;
  }
  else if (ville == 'toulouse') {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=43.6044622&lon=1.4442469&appid=6d82a7f4ef9b59dbaae0aadd35bd679a`;
  }

  try {
    const reponse = await fetch(url);
    const donnees = await reponse.json();
    const jours = calculerMinMaxParJour(donnees.list);
    afficherResult(ville, jours);
  }
  catch (erreur) {
    resultat.innerHTML = "Erreur : " + erreur.message;
  }
}

function calculerMinMaxParJour(liste) {
  const dates = [];
  const jours = [];

  for (const data of liste) {
    const dateData = data.dt_txt.split(" ")[0];

    if (dates.includes(dateData)) {
      continue;
    }

    dates.push(dateData);

    const temperatures = [];

    for (const temperature of liste) {
      if (temperature.dt_txt.split(" ")[0] === dateData) {
        temperatures.push(temperature.main.temp);
      }
    }

    const temperatureMin = Math.round((Math.min(...temperatures) - 273.15) * 10) / 10;
    const temperatureMax = Math.round((Math.max(...temperatures) - 273.15) * 10) / 10;


    jours.push({ date: dateData, min: temperatureMin, max: temperatureMax });
  }

  return jours;
}

function afficherResult(nomVille, jours) {
  let html = "<h2>" + nomVille + "</h2><ul>";
  jours.forEach(j => {
    html += `<li>${j.date} : min = ${j.min} | max = ${j.max}</li>`;
  });
  html += "</ul>";
  resultat.innerHTML = html;
}