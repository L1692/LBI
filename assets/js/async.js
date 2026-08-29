async function caricaDati() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!response.ok) {
            throw new Error(`Errore nel caricamento dei dati: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dati caricati con successo:", data);
        return data;
    } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
    }
}

console.log("Inizio caricamento dati...");

let timer = setTimeout(async () => caricaDati().then(() => {
    console.log("Caricamento dati completato.");
    clearTimeout(timer);
    let h3 = document.getElementsByTagName("h3")[0];
    let p = document.createElement("p");
    p.style.color = "green";
    p.innerHTML = "<p style='color:green'>Dati caricati con successo!</p>";
    h3.appendChild(p);
}).catch((error) => {
    console.error("Errore durante il caricamento dei dati:", error);
    clearTimeout(timer);
}), 20);
