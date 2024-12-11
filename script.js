const cards = document.querySelectorAll('.card');
const characters = document.querySelectorAll('.character');

// Változók a buff állapotához
let isBuffActive = false;
let nextLightningStrikeDamageMultiplier = 1;

// Drag and Drop események
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
});

characters.forEach(character => {
    character.addEventListener('dragover', (e) => {
        e.preventDefault(); // Enable drop event
        character.classList.add('dragover');
    });

    character.addEventListener('dragleave', () => {
        character.classList.remove('dragover');
    });

    character.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            const cardType = draggingCard.dataset.card;

            // A kártya típusának alapján végrehajtott műveletek
            if (cardType === 'Lightning Strike') {
                // Ha Lightning Strike kártyát dobtak le, csökkentsük az HP-t
                const hpText = character.querySelector('.hptext span');
                let currentHp = parseInt(hpText.innerText);
                
                // Ha buff aktív, kétszeres sebzést alkalmazunk
                currentHp -= 20 * nextLightningStrikeDamageMultiplier;
                
                if (currentHp < 0) currentHp = 0; // Ne legyen negatív HP

                hpText.innerText = currentHp; // Frissítjük a HP-t

                // Animáció a HP csíknál is
                const hpBar = character.querySelector('.hpplus');
                const hpWidth = (currentHp / 100) * 100; // A HP csík szélessége
                hpBar.style.width = `${hpWidth}%`; // A szélesség dinamikus frissítése

                triggerShakeAnimation(character); // Rázkódó animáció

                // Ha buff aktív volt, deaktiváljuk
                if (isBuffActive) {
                    isBuffActive = false; // Deaktiváljuk a buffot
                    nextLightningStrikeDamageMultiplier = 1; // Visszaállítjuk az alap sebzést
                }
            }

            // Ha Buff kártyát dobtak le
            if (cardType === 'Buff') {
                // Aktiváljuk a buffot
                isBuffActive = true;
                nextLightningStrikeDamageMultiplier = 2; // A Lightning Strike kétszeres sebzése
            }

            // Ha Healing kártyát dobtak le
            if (cardType === 'Healing') {
                // Ha Healing kártyát dobtak le, adjunk +20 HP-t
                const hpText = character.querySelector('.hptext span');
                let currentHp = parseInt(hpText.innerText);
                currentHp += 20; // HP növelése +20-mal
                if (currentHp > 100) currentHp = 100; // Maximum HP 100 lehet

                hpText.innerText = currentHp; // Frissítjük a HP-t

                // Animáció a HP csíknál is
                const hpBar = character.querySelector('.hpplus');
                const hpWidth = (currentHp / 100) * 100; // A HP csík szélessége
                hpBar.style.width = `${hpWidth}%`; // A szélesség dinamikus frissítése
            }

            // Ha Health Regen kártyát dobtak le
            if (cardType === 'Health Regen') {
                // Ha Health Regen kártyát dobtak le, növeljük a HP-t 10%-kal
                const hpText = character.querySelector('.hptext span');
                let currentHp = parseInt(hpText.innerText);
                const regenAmount = Math.round(currentHp * 0.1); // HP 10%-a
                currentHp += regenAmount;
                if (currentHp > 100) currentHp = 100; // Maximum HP 100 lehet

                hpText.innerText = currentHp; // Frissítjük a HP-t

                // Animáció a HP csíknál is
                const hpBar = character.querySelector('.hpplus');
                const hpWidth = (currentHp / 100) * 100; // A HP csík szélessége
                hpBar.style.width = `${hpWidth}%`; // A szélesség dinamikus frissítése
            }

            // Eltüntetjük a kártyát
            draggingCard.style.display = 'none'; 
            
            // HP szöveg középre helyezése
            const hpText = character.querySelector('.hptext');
            hpText.style.textAlign = 'center'; // Biztosítjuk, hogy középen legyen a szöveg

            // Az animáció befejezését követően eltávolítjuk a rázkódást
            setTimeout(() => {
                character.classList.remove('shaking', 'dragover');
            }, 500); // 500ms után eltávolítjuk az animációkat
        }
    });
});

// Rázkódó animáció alkalmazása
function triggerShakeAnimation(character) {
    character.classList.add('shaking'); // A rázkódó animáció osztály hozzáadása
    setTimeout(() => {
        character.classList.remove('shaking'); // Az animáció eltávolítása
    }, 500); // 500ms után eltávolítjuk az animációt
}
