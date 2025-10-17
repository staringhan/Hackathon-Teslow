# Analyse complète des données Babyfoot connectés

---

## Contexte général

Ce travail vise à **analyser les données d’utilisation des babyfoots connectés** afin de :

* fournir des **insights concrets et exploitables** aux administrateurs,
* **améliorer l’expérience utilisateur** via des indicateurs de performance,
* et **partager des données précises** avec les autres départements du projet (IoT, développement, UX).

Les résultats de cette analyse alimentent :

* la **détermination des meilleurs joueurs**,
* l’**identification du babyfoot le plus utilisé**,
* les **heures de pointe d’utilisation**,
* et l’**impact du choix de camp (rouge/bleu)** sur le résultat des matchs.

---

## Nettoyage et préparation des données

Les données brutes contenaient des doublons, des valeurs manquantes et des formats incohérents.
L’objectif du nettoyage a été de les rendre **cohérentes, homogènes et directement exploitables**.

### Étapes de traitement

1. **Suppression des valeurs manquantes et doublons**

   * Élimination des lignes incomplètes.
   * Suppression des doublons basés sur `(game_id, player_id)` ou `(game_id, player_name, team_color)`.

2. **Correction et uniformisation**

   * Nettoyage des colonnes texte : retrait d’émojis et de symboles.
   * Normalisation des couleurs d’équipe : `Red` / `Blue`.
   * Correction des noms et conversions numériques (âges, buts, scores).

3. **Transformation et normalisation**

   * `game_date` au format **YYYY-MM-DD**.
   * `game_duration` convertie en **minutes** pour faciliter les moyennes.
   * Conversion des scores et buts en **entiers**.
   * Harmonisation des champs catégoriels.

### Justification

Ces opérations garantissent :

* une **fiabilité statistique** (plus de valeurs aberrantes),
* une **comparabilité temporelle et spatiale** entre matchs,
* une **exploitation directe** dans l’application IoT (scores, durées, victoires),
* et une **traçabilité complète** du traitement.

---

## Analyse exploratoire (EDA)

### 1. Meilleurs joueurs

#### Top 10 des buteurs

| Rang | Joueur | Nombre de buts |
| ---- | ------ | -------------- |
| 1    | Julie  | 616            |
| 2    | Emma   | 613            |
| 3    | Maria  | 609            |
| 4    | Morgan | 593            |
| 5    | Mila   | 588            |
| 6    | Ethan  | 587            |
| 7    | Liam   | 567            |
| 8    | Hugo   | 563            |
| 9    | Sofia  | 521            |
| 10   | Casey  | 519            |

 **Julie** domine légèrement, mais les écarts sont faibles : les dix premiers joueurs présentent un niveau offensif très homogène.

![top10buteur](/top10Buteur.png)

#### Top 5 des défenseurs

| Rang | Joueur | Arrêts |
| ---- | ------ | ------ |
| 1    | Maria  | 1387   |
| 2    | Hugo   | 1230   |
| 3    | Morgan | 1195   |
| 4    | Emma   | 1189   |
| 5    | Mila   | 1185   |

 **Maria** se distingue comme la meilleure défenseuse tout en figurant dans le top offensif, montrant une **grande polyvalence**.

![top5Save](/top5Save.png)

---

### 2. Influence du camp

| Camp  | Taux de victoire | Total matchs |
| ----- | ---------------- | ------------ |
| Rouge | 45,1 %           | 19 574       |
| Bleu  | 54,9 %           | 19 574       |

 Le **camp Bleu** gagne environ **10 %** de matchs supplémentaires.
Cela peut s’expliquer par :

* une **meilleure répartition des joueurs expérimentés**,
* ou des **facteurs externes** (position de la table, lumière, etc.).

![tauxVictoire](/tauxVictoire.png)

---

### 3. Durée moyenne et heures de pointe

| Indicateur             | Valeur      |
| ---------------------- | ----------- |
| Nombre total de matchs | ~19 574     |
| Durée moyenne          | ~14 minutes |


![dureeMoyenne](/tempMoyen.png)

---

### 4. Corrélations et insights

| Variables corrélées               | Type de relation | Interprétation                                            |
| --------------------------------- | ---------------- | --------------------------------------------------------- |
| `player_goals` ↔ `team_color`     | Faible           | Légère supériorité du camp bleu                           |
| `player_goals` ↔ `player_age`     | Moyenne          | Les joueurs plus âgés sont souvent plus performants       |
| `game_duration` ↔ `final_score_*` | Positive         | Les matchs longs sont plus disputés                       |
| `player_goals` ↔ `winner`         | Forte            | Les meilleurs buteurs influencent directement la victoire |

 Ces relations sont essentielles pour **les systèmes IoT** : elles permettent d’ajuster en temps réel les statistiques affichées (classements dynamiques, détection d’anomalies, rythme de jeu, etc.).

---

## Base de données et intégration IoT

La base de données sert de **pont entre les capteurs IoT et l’application**.

### MLD Bdd

## MLD — teslow_db

Users(Id PK, UserName UK, Role, PasswordHash, CreatedAt)  
Games(Id PK, Score1, Score2, DurationSeconds, Date)  
GameTables(Id PK, Name UK, Location, IsActive)  
Reservations(Id PK, StartUtc IX, DurationSeconds, Mode, CreatedAtUtc, RowVersion)  
GameTableAssignments(Id PK, ReservationId FK→Reservations.Id, GameTableId FK→GameTables.Id)  
GameTeams(Id PK, GameId FK→Games.Id, TeamNumber, Color)  
TeamPlayers(Id PK, TeamId FK→GameTeams.Id, UserId FK→Users.Id)

### Structure simplifiée

| Table            | Rôle                                   | Champs clés                               |
| ---------------- | -------------------------------------- | ----------------------------------------- |
| **Users**        | Informations sur les joueurs et admins | Id, UserName, Role                        |
| **GameTables**   | Tables physiques connectées            | Id, Name, Location, IsActive              |
| **Games**        | Résultats de match                     | Id, Score1, Score2, DurationSeconds, Date |
| **Reservations** | Gestion des créneaux                   | Id, StartUtc, DurationSeconds, Mode       |
| **GameTeams**    | Composition des équipes                | Id, GameId, TeamNumber, Color             |
| **TeamPlayers**  | Association joueurs ↔ équipes          | Id, TeamId, UserId                        |

### Intégration en temps réel

1. Les **capteurs IoT** détectent les buts, débuts et fins de partie.
2. Les données sont transmises et mises à jour automatiquement dans les tables `Games` et `GameTeams`.
3. Le **système de réservation** bloque une table dès qu’un créneau est actif et la libère après la partie.
4. Les administrateurs peuvent suivre **en direct** :

   * les scores,
   * la disponibilité des tables,
   * les performances des joueurs.

Le lien entre **corrélations (durée, score, performance)** et **base IoT** permet d’optimiser :

* le **classement en temps réel**,
* la **maintenance prédictive** (détection d’anomalies),
* et la **gestion intelligente des réservations**.



ABENOJAR QUENTIN  Data IA