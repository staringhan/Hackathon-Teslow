# ======================== IMPORTATION DES MODULES ========================

from machine import Pin, PWM, ADC, time_pulse_us   # Import des classes/fonctions pour gérer les broches, ADC et mesurer les pulses ultrason
import time                                   # Import du module time pour temporisations et chronométrage
import network
import urequests


# 📶 Paramètres Wi-Fi
SSID = "JNBVNT"
PASSWORD = "2;9819qU"

# ------------------- CONNEXION WIFI ------------------- #

def connecter_wifi():
    wlan = network.WLAN(network.STA_IF) # interface station
    wlan.active(True) # l'activer
    wlan.connect(SSID, PASSWORD) # démarrer la connexion
    print("🔄 Connexion au Wi-Fi...")
    timeout = 10 # délai max (s)
    start = time.time() # point de départ
    while not wlan.isconnected(): # attendre la connexion
        if time.time() - start > timeout:
            print("❌ Échec de connexion")
            return False # abandon si timeout
        time.sleep(1) # pause 1s entre vérifs
    print("✅ Connecté au Wi-Fi")
    print("📡 Adresse IP :", wlan.ifconfig()[0])
    
    return True

# 🔐 Connexion Wi-Fi avant tout le reste
connecter_wifi()
#wifi_connect_time = time.time()
time.sleep(2)  # Attendre 2 secondes avant de lire les joysticks

# ======================== DÉFINITION DES BROCHES DES CAPTEURS ULTRASONS ========================

TRIG_PIN_1 = 5    # Broche GPIO 5 = Trigger du capteur ultrason équipe 1
ECHO_PIN_1 = 18   # Broche GPIO 18 = Echo du capteur ultrason équipe 1

TRIG_PIN_2 = 17   # Broche GPIO 17 = Trigger du capteur ultrason équipe 2
ECHO_PIN_2 = 16   # Broche GPIO 16 = Echo du capteur ultrason équipe 2

# ======================== INITIALISATION DES BROCHES DES CAPTEURS ========================

trig1 = Pin(TRIG_PIN_1, Pin.OUT)   # Configure la broche trigger du capteur 1 en sortie
echo1 = Pin(ECHO_PIN_1, Pin.IN)    # Configure la broche echo du capteur 1 en entrée

trig2 = Pin(TRIG_PIN_2, Pin.OUT)   # Configure la broche trigger du capteur 2 en sortie
echo2 = Pin(ECHO_PIN_2, Pin.IN)    # Configure la broche echo du capteur 2 en entrée

# ======================== CONSTANTES POUR LA DÉTECTION ========================

SEUIL = 21.5             # Seuil en centimètres sous lequel on considère qu'un but est marqué
SCORE_VICTOIRE = 10      # Score maximum pour déterminer la victoire

# ======================== VARIABLES DE SCORE ========================

goal_count_team1 = 0     # Score actuel équipe 1 initialisé à 0
goal_count_team2 = 0     # Score actuel équipe 2 initialisé à 0

goal_detected_team1 = False   # Flag pour éviter double comptage équipe 1
goal_detected_team2 = False   # Flag pour éviter double comptage équipe 2

last_distance_team1 = None    # Stocke la dernière distance mesurée pour l'équipe 1
last_distance_team2 = None    # Stocke la dernière distance mesurée pour l'équipe 2

# ======================== DÉFINITION DES JOYSTICKS ========================

x1_pin = ADC(Pin(34))    # Axe X joystick équipe 1 (entrée analogique GPIO34)
y1_pin = ADC(Pin(35))    # Axe Y joystick équipe 1 (entrée analogique GPIO35)
button1_pin = Pin(32, Pin.IN, Pin.PULL_UP)  # Bouton joystick 1 (entrée, pull-up interne)

x2_pin = ADC(Pin(36))    # Axe X joystick équipe 2 (entrée analogique GPIO26)
y2_pin = ADC(Pin(39))    # Axe Y joystick équipe 2 (entrée analogique GPIO27)
button2_pin = Pin(14, Pin.IN, Pin.PULL_UP)  # Bouton joystick 2 (entrée, pull-up interne)

# ======================== SEUILS DE DÉTECTION DES JOYSTICKS ========================

SEUIL_DROITE = 60000   # Valeur au-dessus de laquelle le joystick est considéré poussé à droite
SEUIL_GAUCHE = 1000    # Valeur en dessous de laquelle le joystick est considéré poussé à gauche
SEUIL_BAS = 1000       # Valeur en dessous de laquelle le joystick est poussé vers le bas (démarrer partie)
SEUIL_HAUT = 60000     # Valeur au-dessus de laquelle le joystick est poussé vers le haut (arrêter partie)

# ======================== DÉFINITION DES LEDS ========================

led_rouge = Pin(0, Pin.OUT)   # LED rouge sur GPIO0 : allumée pendant une partie
led_verte = Pin(2, Pin.OUT)   # LED verte sur GPIO2 : allumée lorsque la partie est terminée

# ======================== DÉFINITION DU BUZZER ========================

#buzzer = Pin(25, Pin.OUT)     # Buzzer connecté sur GPIO25 configuré en sortie
BUZZER_PIN = 25

 # ======================== FONCTIONS ENVOI DES DONNEES ========================

def envoyer_score(team1, team2, duration):

    url = "http://10.242.114.194:5000/message"
    headers = {"Content-Type": "application/json"}
    data = {
        "team1": team1,
        "team2": team2,
        "duration": duration
    }
    try:
        response = urequests.post(url, json=data)
        print("✅ Données envoyées :", response.text)
        response.close()
    except Exception as e:
        print("❌ Erreur d'envoi :", e)
        


# ======================== FONCTIONS DU BUZZER ========================
def bip_debut():
    buzzer = PWM(Pin(BUZZER_PIN))
    buzzer.freq(1200)           # Fréquence moyenne
    buzzer.duty_u16(40000)      # Volume fort
    time.sleep(1.5)             # Bip long
    buzzer.deinit()

def bip_fin():
    for _ in range(3):
        buzzer = PWM(Pin(BUZZER_PIN)) # initialise le buzzer
        buzzer.freq(1500)  # fréquence du bip (1500 Hz)
        buzzer.duty_u16(30000) # volume / puissance
        time.sleep(0.3) # durée du bip
        buzzer.deinit() # éteint le buzzer
        time.sleep(0.2) # pause entre les bips
    # Bip final très long
    buzzer = PWM(Pin(BUZZER_PIN))
    buzzer.freq(1000) # fréquence plus basse pour le bip final
    buzzer.duty_u16(40000) # volume plus fort
    time.sleep(2) # durée longue (2 secondes)
    buzzer.deinit() # éteint le buzzer
 
def bip_but():
    for _ in range(3):
        buzzer = PWM(Pin(BUZZER_PIN))
        buzzer.freq(1500) # fréquence du bip
        buzzer.duty_u16(30000) # volume
        time.sleep(0.15) # durée courte
        buzzer.deinit() # éteint le buzzer
        time.sleep(0.1) # pause très courte
        
def bip_simple(frequence=1000, duree=0.2):
    buzzer = PWM(Pin(BUZZER_PIN)) # initialise le buzzer
    buzzer.freq(frequence) # fréquence du bip (paramétrable)
    buzzer.duty_u16(30000) # volume
    time.sleep(duree)  # durée du bip (paramétrable)
    buzzer.deinit() # éteint le buzzer
    
def buzzer_but():                          # Déclaration fonction pour son de but
    """Émet 3 bips courts pour signaler un but"""   # Docstring expliquant le but de la fonction
    for _ in range(3):                     # Boucle 3 fois pour 3 bips
        buzzer.on()                        # Active le buzzer (HIGH)
        time.sleep(0.1)                    # Maintient 0.1 s
        buzzer.off()                       # Désactive le buzzer
        time.sleep(0.1)                    # Pause 0.1 s entre bips

def buzzer_decrement():                    # Déclaration fonction pour bip de décrémentation
    """Émet un bip long pour signaler une décrémentation"""   # Docstring
    buzzer.on()                            # Active le buzzer
    time.sleep(0.4)                        # Maintient 0.4 s
    buzzer.off()                           # Désactive le buzzer

# ======================== VARIABLES DE PARTIE ========================

match_en_cours = False    # Booléen indiquant si la partie est en cours
start_time = 0            # Horodatage du début de partie (sera mis à time.time())

# ======================== FONCTION : MESURE DE DISTANCE ========================

def measure_distance(trig, echo):          # Déclaration de la fonction prenant trigger et echo en paramètres
    """Mesure la distance en cm avec un capteur ultrason."""   # Docstring
    trig.off()                             # Mettre le trigger à 0 (sécurité)
    time.sleep_us(2)                       # Attendre 2 microsecondes
    trig.on()                              # Envoi d'une impulsion sur le trigger
    time.sleep_us(10)                      # Impulsion de 10 microsecondes (standard HC-SR04)
    trig.off()                             # Couper le trigger

    try:                                   # Tenter la mesure (peut lever OSError si timeout)
        duration = time_pulse_us(echo, 1, 30000)   # Mesure du temps HIGH sur l'echo (max 30ms ici)
        if duration < 0:                  # Si durée négative => échec
            return None                   # Retourne None pour signaler absence de mesure valide
        distance = (duration / 2) * 0.0343   # Conversion du temps en distance (cm)
        return round(distance, 1)            # Retourne la distance arrondie à 0.1 cm
    except OSError:                        # Si erreur pendant la mesure
        return None                        # Retourne None

# ======================== FONCTION : VÉRIFICATION DE LA VICTOIRE ========================

def check_victory():                                      # Déclaration de la fonction check_victory
    """Vérifie si une équipe a atteint le score de victoire."""  # Docstring
    global match_en_cours                                # Indique qu'on utilisera la variable globale match_en_cours
    if goal_count_team1 >= SCORE_VICTOIRE or goal_count_team2 >= SCORE_VICTOIRE:   # Si un score atteint le score de victoire
        fin_de_partie("Score atteint")                    # Appeler la fonction de fin de partie avec la raison

# ======================== FONCTION : DÉBUT DE PARTIE ========================

def debut_de_partie(equipe):                             # Déclaration fonction pour lancer la partie
    """Lance la partie : timer, LED rouge, message."""   # Docstring
    global match_en_cours, start_time                    # Utilisation des variables globales
    match_en_cours = True                                # Indique qu'une partie est maintenant en cours
    start_time = time.time()                             # Sauvegarde l'heure de début (en secondes)
    led_rouge.on()                                       # Allume la LED rouge (partie en cours)
    led_verte.off()                                      # Éteint la LED verte (partie non terminée)
    bip_debut()
    print(f"🚨 Début de partie lancé par l'équipe {equipe}")   # Message d'information dans la console

# ======================== FONCTION : FIN DE PARTIE (AMÉLIORÉE) ========================

def fin_de_partie(source):                               # Déclaration de la fonction pour terminer la partie
    """Termine la partie : affiche le score et la durée, met à jour LEDs, puis réinitialise l'état pour une nouvelle partie."""  # Docstring
    global match_en_cours, goal_count_team1, goal_count_team2      # Indique qu'on utilisera/va modifier ces variables globales
    global goal_detected_team1, goal_detected_team2                # Indique qu'on va réinitialiser les flags de détection
    global last_distance_team1, last_distance_team2                # Indique qu'on va réinitialiser les dernières distances
    global start_time                                               # Accès au timer de début

    match_en_cours = False                               # Marque la partie comme terminée
    led_rouge.off()                                      # Éteint la LED rouge (fin de partie)
    led_verte.on()                                       # Allume la LED verte (partie terminée)
    bip_fin()
    # Calcul de la durée totale de la partie
    duree = time.time() - start_time                     # Durée en secondes depuis start_time
    heures = int(duree // 3600)                          # Calcul du nombre d'heures
    minutes = int((duree % 3600) // 60)                  # Calcul du nombre de minutes restantes
    secondes = int(duree % 60)                           # Calcul des secondes restantes
    duree_str = f"{heures:02d}:{minutes:02d}:{secondes:02d}"

    print(f"\n✅ Fin de partie ({source})")               # Affiche la raison de la fin de partie
    print(f"📊 Score final : {goal_count_team1} - {goal_count_team2}")   # Affiche le score final avant réinitialisation
    print(f"⏱️ Durée de la partie : {duree_str}")
 
    # Envoi des données à la Raspberry Pi
    envoyer_score(goal_count_team1, goal_count_team2, duree_str)

    # ---------- RÉINITIALISATION POUR LA PROCHAINE PARTIE ----------
    # Remise à zéro des compteurs de score pour que la prochaine partie commence à 0-0
    goal_count_team1 = 0                                 # Réinitialise score équipe 1
    goal_count_team2 = 0                                 # Réinitialise score équipe 2

    # Réinitialisation des flags qui évitent le double comptage
    goal_detected_team1 = False                          # Réinitialise flag équipe 1
    goal_detected_team2 = False                          # Réinitialise flag équipe 2

    # Réinitialisation des dernières distances pour forcer l'affichage de la prochaine mesure
    last_distance_team1 = None                            # Supprime la dernière distance pour équipe 1
    last_distance_team2 = None                            # Supprime la dernière distance pour équipe 2

    # Réinitialisation du timer de départ (sécurité)
    start_time = 0                                       # Remet le timer à 0 (sera mis au début d'une nouvelle partie)

    # Message de confirmation de réinitialisation
    print("🔄 Scores et états réinitialisés pour une nouvelle partie")

# ======================== BOUCLE PRINCIPALE ========================

try:                                                    # Bloc try pour attraper KeyboardInterrupt proprement
    while True:                                         # Boucle infinie principale
        # --- Détection du début de partie (joystick vers le bas) ---
        if not match_en_cours:                          # Si aucune partie n'est active
            if y1_pin.read_u16() < SEUIL_BAS:           # Si joystick 1 vers le bas (valeur analogique faible)
                debut_de_partie(1)                      # Démarre la partie pour l'équipe 1
            elif y2_pin.read_u16() < SEUIL_BAS:         # Si joystick 2 vers le bas
                debut_de_partie(2)                      # Démarre la partie pour l'équipe 2
            time.sleep(0.1)                             # Petite pause anti-rebond et CPU-friendly
            continue                                    # Recommence la boucle principale

        # --- Fin de partie via joystick vers le haut ---
        if y1_pin.read_u16() > SEUIL_HAUT or y2_pin.read_u16() > SEUIL_HAUT:   # Si l'un des joysticks est levé vers le haut
            fin_de_partie("Joystick levé")              # Termine la partie manuellement
            continue                                    # Recommence la boucle (attend nouveau match)

        # --- Joystick équipe 1 : rectification du score ---
        x1 = x1_pin.read_u16()                          # Lecture de la valeur analogique axe X joystick 1
        if x1 > SEUIL_DROITE:                           # Si poussé fortement à droite
            goal_count_team1 += 1                       # Incrémente le score pour l'équipe 1
            bip_but()                           # Joue la séquence de bips pour un but
            print(f"🎮 Joystick 1 droite → +1 Équipe 1 | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche score
            time.sleep(0.3)                             # Pause anti-rebond / anti-double comptage
        elif x1 < SEUIL_GAUCHE:                         # Si poussé fortement à gauche
            goal_count_team1 = max(0, goal_count_team1 - 1)   # Décrémente le score (minimum 0)
            bip_simple()                          # Joue bip long pour décrémentation
            print(f"🎮 Joystick 1 gauche → -1 Équipe 1 | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche score
            time.sleep(0.3)                             # Pause anti-rebond

        if not button1_pin.value():                     # Si le bouton du joystick 1 est pressé (valeur = 0)
            goal_count_team1 = 0                        # Réinitialise le score de l'équipe 1
            print(f"🎮 Bouton Joystick 1 → Score Équipe 1 réinitialisé | Score: {goal_count_team1} - {goal_count_team2}") # Info console
            time.sleep(0.3)                             # Petite pause anti-rebond

        # --- Joystick équipe 2 : rectification du score ---
        x2 = x2_pin.read_u16()                          # Lecture de la valeur analogique axe X joystick 2
        if x2 > SEUIL_DROITE:                           # Si poussé à droite
            goal_count_team2 += 1                       # Incrémente le score équipe 2
            bip_but()                               # Joue séquence de bips pour but
            print(f"🎮 Joystick 2 droite → +1 Équipe 2 | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche score
            time.sleep(0.3)                             # Pause anti-rebond
        elif x2 < SEUIL_GAUCHE:                         # Si poussé à gauche
            goal_count_team2 = max(0, goal_count_team2 - 1)   # Décrémente score équipe 2
            bip_simple()                          # Joue bip long
            print(f"🎮 Joystick 2 gauche → -1 Équipe 2 | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche score
            time.sleep(0.3)                             # Pause anti-rebond

        if not button2_pin.value():                     # Si le bouton du joystick 2 est pressé
            goal_count_team2 = 0                        # Réinitialise le score équipe 2
            print(f"🎮 Bouton Joystick 2 → Score Équipe 2 réinitialisé | Score: {goal_count_team1} - {goal_count_team2}") # Info console
            time.sleep(0.3)                             # Petite pause anti-rebond

        # --- Lecture et traitement du capteur équipe 1 ---
        d1 = measure_distance(trig1, echo1)             # Mesure la distance avec le capteur équipe 1
        if d1 is not None:                              # Si la mesure est valide (non None)
            if last_distance_team1 is None or abs(d1 - last_distance_team1) > 0.5:  # Si variation significative depuis dernière lecture
                print(f"[Équipe 1] Distance: {d1:.1f} cm | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche distance et score
                last_distance_team1 = d1               # Mise à jour de la dernière distance
            if d1 < SEUIL and not goal_detected_team1:  # Si la distance passe sous le seuil et pas encore comptée
                goal_count_team1 += 1                   # Incrémente le score équipe 1
                bip_but()                            # Joue la séquence de bips pour but
                print(f"⚽ BUT ÉQUIPE 1 ! | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche message de but
                goal_detected_team1 = True             # Empêche double comptage tant que la balle est dans le but
                check_victory()                         # Vérifie si ce but provoque la victoire
            elif d1 >= SEUIL:                           # Si la balle s'éloigne du but (valeur >= seuil)
                goal_detected_team1 = False             # Réautorise la détection d'un futur but

        # --- Lecture et traitement du capteur équipe 2 ---
        d2 = measure_distance(trig2, echo2)             # Mesure la distance avec le capteur équipe 2
        if d2 is not None:                              # Si mesure valide
            if last_distance_team2 is None or abs(d2 - last_distance_team2) > 0.5:  # Si variation significative
                print(f"[Équipe 2] Distance: {d2:.1f} cm | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche distance
                last_distance_team2 = d2               # Mise à jour de la dernière distance
            if d2 < SEUIL and not goal_detected_team2:  # Si distance passe sous le seuil et pas encore comptée
                goal_count_team2 += 1                   # Incrémente le score équipe 2
                bip_but()                           # Joue la séquence de bips
                print(f"⚽ BUT ÉQUIPE 2 ! | Score: {goal_count_team1} - {goal_count_team2}")  # Affiche message but
                goal_detected_team2 = True             # Empêche double comptage
                check_victory()                         # Vérifie si victoire atteinte
            elif d2 >= SEUIL:                           # Si la distance remonte au-dessus du seuil
                goal_detected_team2 = False             # Réautorise la détection d'un futur but
        else:                                           # Si la mesure du capteur 2 est invalide (None)
            goal_detected_team2 = False                 # S'assurer que le flag est à False pour sécurité

        # --- Petite pause pour éviter surcharge CPU ---
        time.sleep(0.05)                                # Pause de 50 ms pour réduire la charge processeur

except KeyboardInterrupt:                               # Si l'utilisateur interrompt le programme (Ctrl+C)
    print("Programme arrêté manuellement.")            # Message d'arrêt propre

