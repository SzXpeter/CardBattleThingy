// A kártyák drag-and-drop eseményei
const cards = document.querySelectorAll('.card');
const ui = document.getElementById('ui');

cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
});

ui.addEventListener('dragover', (e) => {
    e.preventDefault(); // Engedélyezi a drop eseményt
    const draggingCard = document.querySelector('.dragging');
    const closestCard = getClosestCard(e.clientX, e.clientY);
    ui.insertBefore(draggingCard, closestCard);
});

function getClosestCard(x, y) {
    let closest = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const dist = Math.sqrt(Math.pow(x - rect.x, 2) + Math.pow(y - rect.y, 2));
        if (dist < closestDistance) {
            closestDistance = dist;
            closest = card;
        }
    });
    return closest;
}
