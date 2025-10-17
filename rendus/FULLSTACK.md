# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - FullStack

## Equipe

- Dev' FullStack 1 : ANDRÉ Edgar
- Dev' FullStack 2 : DAMBREVILLE Karl
- Dev' FullStack 3 : PHAKEOVILAY Andrew

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

> Ce fichier contient les informations spécifiques au développement FullStack de votre projet. Il suffit d'en remplir une seule fois, même si vous êtes plusieurs développeurs FullStack dans l'équipe.

# Requis

Ce README contient les requis fonctionnels de la partie FullStack de votre projet. Il doit compléter le README principal à la racine du projet, et servira la partie de votre note propre à votre spécialité.

Basez-vous sur les spécifications dans [SPECIFICATIONS.md](../SPECIFICATIONS.md) pour remplir ce document.

Décrivez ici les fonctionnalités que vous avez implémentées, votre démarche, les choix techniques que vous avez faits, les difficultés rencontrées, etc. Précisez également dans quelle mesure vous avez pu collaborer avec les autres spécialités.

Autrement, il n'y a pas de format imposé, mais essayez de rester clair et concis, je ne vous demande pas de rédiger un roman, passez à l'essentiel, et épargnez-moi de longues pages générées par IA (malusée).

En conclusion, cela doit résumer votre travail en tant que développeur.se FullStack, et vous permettre de garder un trace écrite de votre contribution au projet.

Merci de votre participation, et bon courage pour la suite du hackathon !



# Synthèse des fonctionnalités du projet

L’application propose une page d’accueil attrayante présentant le service et invitant les utilisateurs à s’inscrire ou se connecter.
Le système d’authentification permet la création de comptes et la connexion des utilisateurs (étudiants et administrateurs).
Un dashboard administrateur offre une interface de gestion des babyfoots : visualisation de leur état, disponibilité et statistiques d’utilisation, ainsi que la gestion des utilisateurs (ajout, modification, suppression).

Une API RESTful assure la communication entre le front-end et le back-end, avec un endpoint CRUD complet, des codes retours HTTP appropriés et une documentation via Swagger.
Le code est conçu pour être lisible, maintenable et conforme aux bonnes pratiques de développement.

Remarque : la gestion des rôles (utilisateur standard, administrateur) ainsi que la vue d’ensemble des babyfoots (état, disponibilité, statistiques) ne sont pas encore fonctionnelles au niveau du back-end.

Concernant les choix techniques, le back-end repose sur une API REST développée en C#, technologie maîtrisée par l’équipe.
Le front-end est réalisé avec React, offrant une interface moderne, réactive et facilement extensible.

Une bonne collaboration inter-pôles a également été mise en place :

    Avec le pôle Infrastructure, pour la conteneurisation des applications et la mise en place d’environnements cohérents.

    Avec le pôle Data/IA, pour la définition des modèles de données, la création du dataset et la conception de la base de données.

    Avec le pôle Systèmes embarqués, pour la récupération et la structuration des données issues des capteurs intégrés aux babyfoots.

Cependant, plusieurs difficultés ont été rencontrées au cours du projet :

    Un manque de temps pour finaliser certaines fonctionnalités.

    Une mauvaise communication entre les équipes, notamment concernant la définition et la synchronisation des data models.

    Un manque d’organisation générale ayant parfois freiné l’avancement et la coordination entre les pôles.