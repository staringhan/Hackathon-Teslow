# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - IoT & Mobile - Systèmes Embarqués

## Equipe

- IoT/Mobile / Systèmes Embarqués 1 : SAID Raouni
- IoT/Mobile / Systèmes Embarqués 1 : PHAN David

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

> Ce fichier contient les informations spécifiques aux IoT/Mobile / Systèmes Embarqués de votre projet. Il suffit d'en remplir une seule fois, même si vous êtes plusieurs IoT/Mobile / Systèmes Embarqués dans l'équipe.

# Requis

Ce README contient les requis fonctionnels de la partie IA Data de votre projet. Il doit compléter le README principal à la racine du projet, et servira la partie de votre note propre à votre spécialité.

Basez-vous sur les spécifications dans [SPECIFICATIONS.md](../SPECIFICATIONS.md) pour remplir ce document.

Décrivez ici les actions que vous avez menées, votre démarche, les choix techniques que vous avez faits, les difficultés rencontrées, etc. Précisez également dans quelle mesure vous avez pu collaborer avec les autres spécialités.

Autrement, il n'y a pas de format imposé, mais essayez de rester clair et concis, je ne vous demande pas de rédiger un roman, passez à l'essentiel, et épargnez-moi de longues pages générées par IA (malusée).

En conclusion, cela doit résumer votre travail en tant qu'expert.e IoT / Systèmes Embarqués, et vous permettre de garder un trace écrite de votre contribution au projet.

Merci de votre participation, et bon courage pour la suite du hackathon !

# Équipe Teslow – Système embarqué du babyfoot connecté

## Cahier des charges

- **Détection du but** : détecter automatiquement lorsqu’un but est marqué
- **Rectification** : corriger le score en cas d’erreur (but non détecté ou faux positif)
- **Début / Fin de partie** : gérer l’état du babyfoot (en jeu ou disponible) et récupérer le temps de jeu
- **Buzzer** : émettre un son lors d’un but ou d’une rectification
- **Envoi des données** : transmettre les scores à une base externe
- **Réservation** : indiquer si le babyfoot est réservé
- **Affichage** : afficher le score et signaler les événements par un son

---

## Choix du microcontrôleur

| Critères                      | Raspberry Pi                  | Arduino                       | ESP32                                 |
|------------------------------|-------------------------------|-------------------------------|----------------------------------------|
| Type                         | Ordinateur monocarte (Linux) | Microcontrôleur simple        | Microcontrôleur avec Wi-Fi/Bluetooth  |
| Connectivité réseau          | Wi-Fi, Ethernet              | Aucune sans module externe    | Wi-Fi + Bluetooth intégrés            |
| Capteurs (ultrasons)         | GPIO, code bas niveau        | Très bon pour capteurs simples| Très bon aussi                        |
| Affichage (LEDs, 7 segments) | Possible via GPIO            | Très simple à gérer           | Très simple à gérer                   |
| Buzzer / boutons             | Facile via GPIO              | Très facile                   | Très facile                           |
| Base de données MySQL        | Peut héberger directement    | Impossible sans intermédiaire | Doit envoyer les données à un serveur |
| Démarrage / stabilité        | Plus lent, dépend d’un OS    | Instantané, très stable       | Instantané, très stable               |

### Pourquoi l’ESP32 ?

- Compact, puissant et sans fil
- Gère tous les capteurs, LEDs, écran et buzzer
- Communique en Wi-Fi
- Rapide, autonome et évolutif

---

## Capteurs et périphériques connectés

| Composant             | Rôle                                                  |
|----------------------|--------------------------------------------------------|
| Capteur à ultrasons  | Détecte les buts                                       |
| Écran 7 segments     | Affiche le score                                       |
| Buzzer               | Émet un son à chaque événement                         |
| LEDs (rouge, verte, orange) | Indiquent l’état du babyfoot (en jeu, dispo, réservé) |
| Joysticks            | Rectification du score, début/fin de partie            |

---
## Détection du but

- Capteur à ultrasons connecté via GPIO
- Tension en sortie calculée par :
Vout = Vin × R2 / (R1 + R2) 
Vout = 5.2 × 2 / (1 + 2) = 3.3V

- Script Python en lecture continue
- Lorsqu’un but est détecté :
- Le score est incrémenté
- Les données sont envoyées à une base MySQL

---

## Rectification du score

### Équipe 1

- Joystick :
- Droite → +1 point
- Gauche → –1 point
- Bouton pressé → score réinitialisé

### Équipe 2

- Joystick avec broche ADC différente (interférence corrigée)
- Même logique que l’équipe 1

---

## Début / Fin de partie

- Joystick vers le bas → démarre le match
- Lance un timer
- Allume LED verte
- Affiche le joystick déclencheur

- Joystick vers le haut ou score ≥ 10 → fin du match
- Affiche le temps écoulé
- Éteint LED verte, allume LED blanche
- Affiche le score final

### Calcul LED

- Tension ESP32 : 3.3V
- Tension LED typique : ~2V
- Résistance : 220 Ω
- Courant : `I = U / R = 1.3 / 220 ≈ 5.9 mA`

---

## Utilisation du buzzer

- Connecté via GPIO
- Sons émis :
- 3 bips courts → but marqué
- 1 bip long → décrémentation

---

## Envoi des données

- Connexion Wi-Fi au démarrage
- Envoi du score à une Raspberry Pi via requête HTTP POST

---

## Amélioration du buzzer (PWM)

Utilisation du PWM pour produire de vrais sons :

| Fonction       | Effet sonore                            |
|----------------|------------------------------------------|
| `bip_simple()` | Bip court pour décrémentation            |
| `bip_but()`    | 3 bips courts pour but marqué            |
| `bip_debut()`  | Bip long pour début de match             |
| `bip_fin()`    | 3 bips courts + 1 bip long pour fin de match |

---


