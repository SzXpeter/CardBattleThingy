class Card {
    constructor(Type, Mana, Value, Image, UsableOn ,Desc) {
        this.Type = Type;
        this.Mana = Mana;
        this.Value = Value;
        this.Image = Image;
        this.UsableOn = UsableOn;
        this.Desc = Desc;
    }
}
const CardTypes = [
    new Card("Attack",          1, 15, "Pictures/Cards/Attack.png",          "Enemy",  "<span>kard támadás</span><br><br>15 sebzést okoz"),
    new Card("LightningStrike", 1, 10, "Pictures/Cards/LightningStrike.png", "Enemy",  "<span>villám csapás</span><br><br>10 sebzést okoz, ha az ellenség el van kábítva kétszer annyit sebez"),
    new Card("PommelStrike",    0, 5,  "Pictures/Cards/PommelStrike.png",    "Enemy",  "<span>kardgomb csapás</span><br><br>4 sebzést okoz és elkábítja az ellenséget 1 körre(nem stackelődik)"),
    new Card("Heal",            3, 25, "Pictures/Cards/Heal.png",            "Player", "<span>gyógítás</span><br><br>25 életerőt gyógyít"),
    new Card("AttackDebuff",    2, 25, "Pictures/Cards/AttackDebuff.png",    "Enemy",  "<span>támadás gyengítés</span><br><br>Az ellenség 25%-kal kevesebbet sebez 3 körig"),
    new Card("DefenseDebuff",   2, 50, "Pictures/Cards/DefenseDebuff.png",   "Enemy",  "<span>védelem gyengítés</span><br><br>Az ellenség 50%-kal több sebzést kap 3 körig"),
    new Card("AttackUp",        3, 25, "Pictures/Cards/AttackUp.png",        "Player", "<span>támadás erősítés</span><br><br>A játékos 25%-kal több sebzést okoz 3 körig"),
    new Card("DrawCards",       1, 2,  "Pictures/Cards/DrawCards.png",       "Player", "<span>kártya húzás</span><br><br>2 kártyát húz"),
]

class Enemy {
    constructor (Name, Health, Damage, Image ,Desc) {
        this.Name = Name;
        this.Health = Health;
        this.Damage = Damage;
        this.Image = Image;
        this.Desc = Desc;
    }
}
const EnemyTypes = [
    new Enemy("Tank",     150, 5,  "Pictures/Tank.png",     "5 sebzés, 5 életerő gyógyítás"),
    new Enemy("Assassin", 50,  12, "Pictures/Assassin.png", "12 sebzés"),
    new Enemy("Mage",     100, 8,  "Pictures/Mage.png",     "8 sebzés"),
    new Enemy("Healer",   100, 15, "Pictures/Healer.png",   "15 életerő gyógyítás"),
    new Enemy("Boss",     300, 15, "Pictures/Boss.png",     "15 sebzés"),
]

const Rounds = [
    [EnemyTypes[0], EnemyTypes[1], EnemyTypes[1]],
    [EnemyTypes[0], EnemyTypes[2], EnemyTypes[2]],
    [EnemyTypes[4], EnemyTypes[3], EnemyTypes[3]],
]

const UI = document.getElementById("cards");
const Enemies = document.getElementById("enemies")
const CurrentHand = [null, null, null, null, null, null, null];
const CurrentEnemies = [null, null, null];

const observer = new MutationObserver(() => {
    percentage = document.querySelector("#mana .current").innerText / 5 * 100;
    document.getElementById("mana-container").style.backgroundColor = `linear-gradient(90deg, rgba(85, 85, 255, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
    document.getElementById("mana-current-player").innerText = document.querySelector("#mana .current").innerText;
});
observer.observe(document.querySelector("#mana .current"), { characterData: true, subtree: true, childList: true });

function NextRound() {
    const CurrentRound = document.getElementById("current-round").innerText;
    CreateEnemy(Rounds[CurrentRound - 1][0]);
    CreateEnemy(Rounds[CurrentRound - 1][1]);
    CreateEnemy(Rounds[CurrentRound - 1][2]);

    document.querySelector("#mana .current").innerText = 5;

    for (i = 0; i < CurrentHand.length; i++)
    {
        if (CurrentHand[i] != null)
        {
            CurrentHand[i] = null;
            document.getElementById(`card-${i}`).remove();
        }
    }

    for (i = 0; i < 5; i++)
        CreateCard(RandomCard());
}

function NextTurn() {
    index = 0;
    CurrentEnemies.forEach(enemy => {
        if (enemy != null && !document.getElementById(`enemy${index}`).classList.contains("stunned"))
        {
            switch (enemy.Name) {
                case "Tank":
                    for (i = 0; i < 3; i++)
                    {                      
                        document.getElementById("health-current-player").innerText -= 5;

                        CurrentHealth = document.getElementById(`health-current-enemy-${i}`);
                        MaxHealth = document.getElementById(`health-max-enemy-${i}`);
                        if (CurrentHealth.innerText + 5 <= MaxHealth.innerText)
                            CurrentHealth.innerText = parseInt(CurrentHealth.innerText) + 5;
                        else if (CurrentHealth.innerText < MaxHealth.innerText)
                            CurrentHealth.innerText = MaxHealth.innerText;
                    }
                    break;
                case "Assassin":
                    document.getElementById("health-current-player").innerText -= 12;
                    break;
                case "Mage":
                    document.getElementById("health-current-player").innerText -= 8;
                    break;
                case "Healer":
                    CurrentHealth = document.getElementById(`health-current-enemy-1`);
                    MaxHealth = document.getElementById(`health-max-enemy-1`);
                    if (CurrentHealth.innerText + 15 <= MaxHealth.innerText)
                        CurrentHealth.innerText += 15;
                    else if (CurrentHealth.innerText < MaxHealth.innerText)
                        CurrentHealth.innerText = MaxHealth.innerText;
                    break;
                case "Boss":
                    document.getElementById("health-current-player").innerText -= 15;
                    break;
            
                default:
                    break;
            }
        }
        index++;
    });

    document.querySelector("#mana .current").innerText = 5;

    for (i = 0; i < CurrentHand.length; i++)
    {
        if (CurrentHand[i] != null)
        {
            CurrentHand[i] = null;
            document.getElementById(`card-${i}`).remove();
        }
    }

    for (i = 0; i < 5; i++)
        CreateCard(RandomCard());
}

function RandomCard() {
    rand = Math.floor(Math.random() * 100);
    
    if (rand < 25)
        return CardTypes[0];
    else if (rand < 40)
        return CardTypes[1];
    else if (rand < 50)
        return CardTypes[2];
    else if (rand < 65)
        return CardTypes[3];
    else if (rand < 75)
        return CardTypes[4];
    else if (rand < 85)
        return CardTypes[5];
    else if (rand < 90)
        return CardTypes[6];
    else
        return CardTypes[7];
}

function CreateCard(card) {
    index = FirstFreeIndex(CurrentHand);
    if (index == -1)
        return;

    const CardElement = document.createElement('div');
    CardElement.classList.add('card');
    CardElement.id = `card-${index}`;
    CardElement.draggable = "true";
    CardElement.dataset.cardType = card.Type;
    CardElement.dataset.type = card.UsableOn;

    const CardImg = document.createElement("img");
    CardImg.src = card.Image;
    CardImg.classList.add("card-img");
    CardElement.appendChild(CardImg);

    const CardText = document.createElement("p");
    CardText.innerHTML = card.Desc;
    CardText.classList.add("card-text");
    CardElement.appendChild(CardText);

    const ManaCost = document.createElement("p");
    ManaCost.innerText = card.Mana;
    ManaCost.classList.add("card-mana");
    CardElement.appendChild(ManaCost);

    CardElement.addEventListener('dragstart', function() {
        event.dataTransfer.setData('text/plain', event.target.dataset.type);
        event.dataTransfer.setData('id', event.target.id);
        console.log(event.target.dataset.type);
        console.log(event.target.id);
    });
    CardElement.addEventListener('drag', function() {
        CardElement.style.display = "none";
    });
    CardElement.addEventListener('dragend', function() {
        CardElement.style.display = "inline";
    });
    CardElement.addEventListener('animationend', function() {
        CardElement.style.animation = "none";
    });
    CardElement.addEventListener('mouseenter', function() {
        CardElement.style.zIndex = "100";
    });
    CardElement.addEventListener('mouseout', function() {
        AdjustCards();
    });

    UI.appendChild(CardElement);
    CurrentHand[index] = card;
    AdjustCards();
}

function FirstFreeIndex(tomb) {
    i = 0
    while (i < tomb.length && tomb[i] != null)
        i++;

    if (i < tomb.length)
        return i;
    else
        return -1;
}

function AdjustCards() {
    num = 0;
    CurrentHand.forEach(card => {
        if (card != null)
            num++;
    });

    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.zIndex = index;
        card.style.margin = `0 -${num*5}px`
    });

}

function CreateEnemy(enemy) {
    const index = FirstFreeIndex(CurrentEnemies);
    if (index == -1)
        return;

    const EnemyElement = document.createElement("div");
    EnemyElement.id = "enemy" + index;
    EnemyElement.classList.add("enemy");
    EnemyElement.classList.add("enemy-" + index);
    EnemyElement.dataset.enemyType = enemy.Name;
    EnemyElement.dataset.accept = "Enemy";

    const dmg = document.createElement("p");
    dmg.id = "dmg-" + index;
    dmg.innerText = enemy.Damage;
    dmg.style.display = "none";
    EnemyElement.appendChild(dmg);

    const health = document.createElement("p");
    health.classList.add("hp-container");
    health.id = "health-" + index;

    const CurrentHealth = document.createElement("span");
    CurrentHealth.id = `health-current-enemy-${index}`;
    CurrentHealth.innerText = enemy.Health;

    const MaxHealth = document.createElement("span");
    MaxHealth.id = `health-max-enemy-${index}`;
    MaxHealth.innerText = enemy.Health;

    health.appendChild(CurrentHealth);
    health.innerHTML += " / ";
    health.appendChild(MaxHealth);
    EnemyElement.appendChild(health);

    const Intentions = document.createElement("p");
    Intentions.innerHTML = "<h2>Indulatok: </h2> " + enemy.Desc;
    Intentions.classList.add("intentions");
    EnemyElement.appendChild(Intentions);

    // Add MutationObserver for CurrentHealth changes
    const observer = new MutationObserver(() => {
        const current = parseInt(document.getElementById(CurrentHealth.id).innerText, 10);
        const max = parseInt(document.getElementById(MaxHealth.id).innerText, 10);
        const percentage = (current / max) * 100;

        health.style.background = `linear-gradient(90deg, rgba(255, 0, 0, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
        document.getElementById(EnemyElement.id).style.animation = "none";
        document.getElementById(EnemyElement.id).style.animation = "shake 0.2s";
        
        if (current <= 0)
        {
            document.getElementById(EnemyElement.id).remove();
            CurrentEnemies[index] = null;
        }
    });

    observer.observe(health, { characterData: true, subtree: true, childList: true });

    const image = document.createElement("img");
    image.src = enemy.Image;
    EnemyElement.appendChild(image);

    EnemyElement.addEventListener('animationend', function() {
        document.getElementById(EnemyElement.id).style.animation = "none";
    });
    EnemyElement.addEventListener('dragover', DragOver);

    Enemies.appendChild(EnemyElement);
    CurrentEnemies[index] = enemy;
}

function DragOver(event) {
    const draggedType = event.dataTransfer.getData('text/plain');
    const acceptType = event.target.dataset.accept;

    if (draggedType == acceptType)
    {
        event.preventDefault();
    }
}