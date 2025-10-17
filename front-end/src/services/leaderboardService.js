export async function fetchLeaderboard() {
  try {
    const res = await fetch("https://localhost:8080/api/Users/leaderboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data; // tableau d'objets { userId, userName, gamesPlayed }
  } catch (err) {
    console.error("fetchLeaderboard error:", err);
    return []; // retourne un tableau vide si erreur
  }
}
