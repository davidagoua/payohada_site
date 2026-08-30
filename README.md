# PAYOHADA Premium Site

Prototype frontend statique prêt à prévisualiser.

## Fichiers
- index.html
- styles.css
- app.js

## Prévisualisation locale
Ouvrir simplement `index.html` dans un navigateur.

## Mise en production
Vous pouvez héberger ces fichiers sur Vercel, Netlify, Cloudflare Pages, GitHub Pages ou votre serveur actuel.

## À connecter
- formulaire de démonstration -> HubSpot / Brevo / Pipedrive / Make / Zapier
- bouton Connexion -> application PAYOHADA
- simulateur -> vrai moteur réglementaire backend
- analytics -> Plausible / Matomo / GA4
- calendrier -> Calendly ou équivalent

## Important
Les calculs du simulateur inclus ici sont purement illustratifs et ne doivent pas être utilisés comme calculs réels de paie.


## Mise à jour tarification
La section tarifs inclut désormais Starter, Business, Premium et Cabinet Pro, un toggle mensuel/annuel, une grille dégressive cabinets et des notes d'onboarding.


## Calculateur tarifaire interactif
Le site inclut désormais un calculateur basé sur le profil, le volume mensuel de bulletins et la facturation mensuelle/annuelle. Pour les cabinets, le tarif par bulletin devient automatiquement dégressif.


## Formulaire de démo connecté au calculateur
Le profil tarifaire, le volume, la périodicité, l'estimation et le prix par bulletin sont maintenant copiés automatiquement dans des champs cachés du formulaire de demande de démo. Le profil et la tranche de volume sont aussi préremplis côté formulaire.


## Tarification par pays
La version V5 ajoute une logique tarifaire dynamique par pays :
- Côte d'Ivoire (FCFA/XOF)
- Sénégal (FCFA/XOF)
- Cameroun (XAF)
- Bénin (FCFA/XOF)
- Togo (FCFA/XOF)

Le sélecteur de pays met à jour les cartes tarifaires, la grille cabinets, le calculateur et le formulaire de démonstration.
Les montants intégrés sont des recommandations commerciales de lancement et doivent être validés avant mise en production définitive.


## V7 — Site premium fusionné
Cette version fusionne le site premium V5 et les 5 landing pages SEO V6.

Routes pays :
- /cote-divoire/
- /senegal/
- /cameroun/
- /benin/
- /togo/

Fonctionnalités intégrées :
- homepage premium V5 conservée
- tarification dynamique par pays sur la homepage
- calculateur tarifaire interactif
- formulaire de démo connecté au calculateur
- 5 landing pages SEO locales
- tarifs et devise par pays
- simulateur local sur chaque page
- formulaires de démo pays
- maillage interne entre homepage et pages pays
- liens entre pages pays
- sitemap.xml et robots.txt
- balises canonical et données structurées déjà présentes sur les landing pages

Important : les tarifs sont des recommandations commerciales et les règles sociales/fiscales locales doivent être juridiquement validées avant promesse de conformité en production.


## V8 — Logos officiels intégrés
- Logo horizontal officiel intégré dans le header et le footer de la homepage.
- Logo horizontal intégré sur les 5 landing pages pays.
- Symbole PAYOHADA utilisé dans le dashboard et les cartes pays.
- Favicon généré à partir du symbole.
- Les arrière-plans quadrillés/blancs des PNG fournis ont été rendus transparents pour une intégration web propre.
- Assets : /assets/payohada-logo.png, /assets/payohada-icon.png, /assets/favicon.png.
