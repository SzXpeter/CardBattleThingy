const cards = document.querySelectorAll('.card');
const characters = document.querySelectorAll('.character');

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
            const characterName = character.dataset.name;

            // A kártya típusának alapján végrehajtott műveletek
            if (cardType === 'Lightning Strike') {
                // Ha Lightning Strike kártyát dobtak le, csökkentsük az HP-t 20-al
                const hpText = character.querySelector('.hptext span');
                let currentHp = parseInt(hpText.innerText);
                currentHp -= 20; // Csökkentjük a HP-t 20-mal
                if (currentHp < 0) currentHp = 0; // Ne legyen negatív HP

                hpText.innerText = currentHp; // Frissítjük a HP-t

                // Animáció a HP csíknál is
                const hpBar = character.querySelector('.hpplus');
                const hpWidth = (currentHp / 100) * 100; // A HP csík szélessége
                hpBar.style.width = `${hpWidth}%`; // A szélesség dinamikus frissítése

                triggerShakeAnimation(character); // Rázkódó animáció
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
