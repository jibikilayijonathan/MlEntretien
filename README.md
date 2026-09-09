# MEL ENTRETIEN — Page d'accueil

Intégration statique de la maquette (`screen.png`) en HTML / CSS / JS.

## Structure

```
index.html           Page d'accueil complète
services.html        Page Services
apropos.html         Page À Propos
galerie.html         Page Galerie (filtres, visionneuse, avant/après)
contact.html         Page Contact (formulaire de devis)
style.css            Styles (variables CSS, responsive, animations)
script.js            Menu mobile, scroll-spy, compteurs, animations
logo.svg             Logo (goutte + P + éclats), redessiné en vectoriel
*.jpg                Photos (toutes à la racine du dossier)
```

## Images à fournir

Les zones visuelles ont un dégradé de secours : la page fonctionne sans images.
Pour le rendu final, déposez ces fichiers à la racine du dossier :

| Fichier            | Emplacement                     |
|--------------------|---------------------------------|
| `hero.jpg`         | ✅ **Fourni** — l'équipe MEL ENTRETIEN, recadrée en 1920×1080, groupe calé à droite |
| `team-member.jpg`  | ✅ **Fourni** — deux collaboratrices nettoyant une baie vitrée (section « Pourquoi »), carré 900×900 |
| `team.jpg`         | ✅ **Fourni** — l'équipe pouces levés, bandeau 1600×900 |
| `service-particuliers.jpg` | ✅ **Fourni** — montage avant/après d'un sous-sol, carré 900×900 |
| `service-bureaux.jpg`      | ✅ **Fourni** — deux agents en open space, 1200×900 |
| `service-commerces.jpg`    | ✅ **Fourni** — autolaveuse en surface de vente, 1200×900 |
| `local-equipe.jpg`         | ✅ **Fourni** — l'équipe et le véhicule (accueil, « Ancrage local »), 1200×900 |
| `about-engagement.jpg`     | ✅ **Fourni** — agent à la raclette sur cloison vitrée, 1150×920 |
| `gal-bureaux.jpg`          | ✅ **Fourni** — équipe en intervention, open space, 1600×900 |
| `gal-cuisine.jpg`          | ✅ **Fourni** — plan de travail en cuisine, portrait 900×968 |
| `gal-boutique.jpg`         | ✅ **Fourni** — lavage de sol en boutique, 1600×1000 |
| `gal-table.jpg`            | ✅ **Fourni** — table de réunion, 1600×1000 |
| `gal-hall.jpg`             | ✅ **Fourni** — hall d'accueil, vitrage, 1600×900 |
| `ba-avant.jpg`             | ✅ **Fourni** — couloir souillé, 1600×900 |
| `ba-apres.jpg`             | ✅ **Fourni** — même couloir nettoyé, recadrage identique |

## Lancer

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```
npx serve .
```

## Animations (JS)

- Entrée en fondu/glissé du héro au chargement
- Apparition au scroll avec décalage (« stagger ») des blocs et des étapes
- Compteurs chiffrés animés dans la barre de stats
- Parallaxe légère sur la photo héro et la carte flottante
- Effet de tilt 3D au survol des visuels
- Barre de progression qui se remplit le long de la timeline du processus
- Boutons « magnétiques » au survol
- Bouton retour en haut + ombre du header au scroll
- Tout est désactivé si `prefers-reduced-motion` est actif

## Logo

`logo.svg` est une **redessin vectoriel** du logo (anneau bleu, goutte
formant un P, trois éclats). Il sert d'en-tête, de pied de page, d'encart « secteur »
et de favicon.

Si vous avez le fichier d'origine, écrasez simplement `logo.svg`
(ou déposez un `.png` et remplacez les 4 `src="logo.svg"` dans
`index.html`). Couleur utilisée : `#1B4B9E`.

## Formulaire de devis — à activer

Le formulaire de `contact.html` valide les champs mais **n'envoie rien** : aucune
destination n'est configurée. Un message le dit clairement au visiteur plutôt que
de simuler un envoi réussi.

Pour l'activer :

1. Renseigner `action` (et `method="post"`) sur `<form id="devis-form">` —
   Formspree, Netlify Forms, ou un script PHP côté serveur.
2. Supprimer l'attribut `data-form-inactive` sur ce même `<form>`.

## Carte

La page Contact intègre une carte **OpenStreetMap** centrée sur le 15 rue Noël
Ruffier, 60250 Mouy (coordonnées 49.320553, 2.324759, géocodées via
api-adresse.data.gouv.fr).

Choix d'OSM plutôt que Google Maps : **aucune clé d'API, aucun cookie déposé**,
donc pas de bandeau de consentement RGPD à prévoir.

## À personnaliser

- Coordonnées renseignées : téléphone `+33 7 58 40 88 92`, email `mlentretien@gmail.com`.
- Horaires affichés : 24h/24 · 7j/7 (page Contact).
- Couleurs : variables `--blue`, `--navy`… en haut de `style.css`.
- Liens du pied de page (Mentions Légales, CGU…).
