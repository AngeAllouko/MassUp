import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function exporterBilanSemaine({ profil, objectifs, journee, repas, historiquePoids }) {
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const pctCalories = Math.round((journee.caloriesConsommees / (objectifs.calories || 1)) * 100);
  const pctProteines = Math.round((journee.proteinesConsommees / (objectifs.proteines || 1)) * 100);
  const pctEau = Math.round((journee.eauConsommee / (objectifs.hydratation || 1)) * 100);

  const poidsActuel = historiquePoids.length > 0
    ? historiquePoids[historiquePoids.length - 1].valeur
    : profil.poids;

  const lignesRepas = repas.length > 0
    ? repas.map((r) => `  - ${r.nom} (${r.quantite}g) : ${r.calories} kcal`).join('\n')
    : '  Aucun repas enregistré';

  const contenu = `
MASSUP — BILAN JOURNALIER
==========================
${date.charAt(0).toUpperCase() + date.slice(1)}

PROFIL
------
Nom         : ${profil.nom}
Poids actuel: ${poidsActuel} kg
Niveau      : ${profil.niveau}

OBJECTIFS DU JOUR
-----------------
Calories    : ${objectifs.calories} kcal
Proteines   : ${objectifs.proteines} g
Glucides    : ${objectifs.glucides} g
Lipides     : ${objectifs.lipides} g
Hydratation : ${objectifs.hydratation} ml

BILAN DU JOUR
-------------
Calories    : ${journee.caloriesConsommees} kcal (${pctCalories}%)
Proteines   : ${journee.proteinesConsommees} g (${pctProteines}%)
Glucides    : ${journee.glucidesConsommes} g
Lipides     : ${journee.lipidesConsommes} g
Eau         : ${journee.eauConsommee} ml (${pctEau}%)

REPAS ENREGISTRES
-----------------
${lignesRepas}

HISTORIQUE POIDS (7 derniers)
------------------------------
${historiquePoids.slice(-7).map((p) => `  ${p.date} : ${p.valeur} kg`).join('\n') || '  Aucune pesée enregistrée'}

==========================
Généré par MassUp v1.0.0
`.trim();

  const chemin = `${FileSystem.documentDirectory}MassUp_Bilan_${new Date().toISOString().split('T')[0]}.txt`;

  await FileSystem.writeAsStringAsync(chemin, contenu, {
    encoding: 'utf8',
  });

  const disponible = await Sharing.isAvailableAsync();
  if (!disponible) {
    throw new Error('Le partage n\'est pas disponible sur cet appareil.');
  }

  await Sharing.shareAsync(chemin, {
    mimeType: 'text/plain',
    dialogTitle: 'Partager mon bilan MassUp',
  });
}