# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - Cloud & Infrastructure

## Equipe

- Cloud & Infra 1 : BONVENT Jean-Noël
- Cloud & Infra : DEVIENNE Arthur

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

> Ce fichier contient les informations spécifiques au Cloud & Infra de votre projet. Il suffit d'en remplir une seule fois, même si vous êtes plusieurs Cloud & Infra dans l'équipe.

# Requis

Pour l'installation, nous avons choisis d'utiliser une combinaison de docker et de ansible, ce choix viens du fait que nous étions déjà à l'aise sur ces technologies mais nous pensons également que la conteneurisation est un très bon moyen de déployer des applications de ce type.

## Simplicité de déploiement

Pour un déploiement simple et efficace, nous utilisons donc ansible ansi que quelques scripts, ansible assure une installation controlés des services en une seul ligne de commande.

Nous nous retrouvons donc au final avec une installation qui utilise moins de 10 commandes.

## Sécurité et protection

Pour la partie sécurité, nous avons commencer par faire un état des lieux de la machine qui gère l'infra. Cette machine n'as pas pour but d'avoir de user mais elle doit également être bien isolé.

Nous avons donc configuré des règles de firewall sur cette machine qui n'ouvrent que les ports que nous utilisons avec les dockers (+ le ssh)

## Base de données

Nous avons choisis la base de données en collaboration avec la partie fullstack et IA/DATA, nous nous sommes arrêté sur le déploiement d'une base mysql via un docker compose.

## Surveillance et journalisation
Pour la partie surveillance, nous avons choisis d'utiliser portainer et cockpit.

Portainer nous permets d'avoir une bonne vue de nos services en container pour voir 

## Scalabilité

Nous avons utilisé une raspberry pie en tant que solution d'installation, par conséquent la scalabilité n'est pas très bonne, il aurait fallut soit faire un cluster kube avec plusieurs raspbery, soit déployer sur une infra cloud comme aws.

## Conclusion

Tous nos fichiers de configurations sont dispo dans ce dépot, il manque quelques intégrations nottament le front et le back à la stack ansible / docker.
s