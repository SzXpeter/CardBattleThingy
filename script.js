class Card {
    constructor(Type, Mana, Value, Image, Desc) {
        this.Type = Type;
        this.Mana = Mana;
        this.Value = Value;
        this.Image = Image;
        this.Desc = Desc;
    }
}
const CardTypes = [
    new Card("Attack",          1, 15, "Pictures/Cards/Attack.png",          "<span>kard támadás</span><br><br>15 sebzést okoz"),
    new Card("LightningStrike", 1, 10, "Pictures/Cards/LightningStrike.png", "<span>villám csapás</span><br><br>10 sebzést okoz, ha az ellenség el van kábítva kétszer annyit sebez"),
    new Card("PommelStrike",    0, 4,  "Pictures/Cards/PommelStrike.png",    "<span>kardgomb csapás</span><br><br>4 sebzést okoz és elkábítja az ellenséget 1 körre"),
    new Card("Heal",            3, 25, "Pictures/Cards/Heal.png",            "<span>gyógítás</span><br><br>25 életerőt gyógyít"),
    new Card("AttackDebuff",    2, 25, "Pictures/Cards/AttackDebuff.png",    "<span>támadás gyengítés</span><br><br>Az ellenség 25%-kal kevesebbet sebez 3 körig"),
    new Card("DefenseDebuff",   2, 50, "Pictures/Cards/DefenseDebuff.png",   "<span>védelem gyengítés</span><br><br>Az ellenség 50%-kal több sebzést kap 3 körig"),
    new Card("AttackUp",        3, 25, "Pictures/Cards/AttackUp.png",        "<span>támadás erősítés</span><br><br>A játékos 25%-kal több sebzést okoz 3 körig"),
    new Card("Block",           1, 8,  "Pictures/Cards/Block.png",           "<span>védekezés</span><br><br>A játékos kap 8 pajzsot"),
    new Card("DrawCards",       1, 2,  "Pictures/Cards/DrawCards.png",       "<span>kártya húzás</span><br><br>2 kártyát húz"),
]

class Enemy {
    constructor (Name, Health, Damage, Image) {
        this.Name = Name 
        this.Health = Health 
        this.Damage = Damage
        this.Image = Image
    }
}
const EnemyTypes = [
    new Enemy("Tank",     150, 10, "Pictures/Tank.png"),
    new Enemy("Assassin", 50,  20, "Pictures/Assassin.png"),
    new Enemy("Mage",     100, 10, "Pictures/Mage.png"),
    new Enemy("Healer",   100, 5,  "Pictures/Healer.png"),
    new Enemy("Boss",     300, 15, "Pictures/Boss.png"),
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

function NextRound() {
    const CurrentRound = document.getElementById("current-round").innerText;
    CreateEnemy(Rounds[CurrentRound - 1][0]);
    CreateEnemy(Rounds[CurrentRound - 1][1]);
    CreateEnemy(Rounds[CurrentRound - 1][2]);

    NextTurn();
}

function NextTurn() {
    document.querySelector("#mana .current").innerText = 5;

    // while (FirstFreeIndex() != -1)
    // {

    // }

    for (i = 0; i < 5; i++)
        CreateCard(RandomCard());
}

function RandomCard() {
    rand = Math.floor(Math.random() * 100);
    
    if (rand < 15)
        return CardTypes[0];
    else if (rand < 25)
        return CardTypes[1];
    else if (rand < 40)
        return CardTypes[2];
    else if (rand < 50)
        return CardTypes[3];
    else if (rand < 60)
        return CardTypes[4];
    else if (rand < 70)
        return CardTypes[5];
    else if (rand < 80)
        return CardTypes[6];
    else if (rand < 95)
        return CardTypes[7];
    else
        return CardTypes[8];
}

function CreateCard(card) {
    index = FirstFreeIndex(CurrentHand);
    if (index == -1)
        return;

    const CardElement = document.createElement('div');
    CardElement.classList.add('card');
    CardElement.id = `card-${index}`;
    CardElement.classList.add(card.Type);

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

    if (CurrentHand.length) {
        UI.appendChild(CardElement);
        CurrentHand[index] = CardElement;
    }
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
    EnemyElement.classList.add(enemy.Name);
    EnemyElement.classList.add("enemy");
    EnemyElement.classList.add("enemy-" + index);

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

    if (CurrentEnemies.length) {
        Enemies.appendChild(EnemyElement);
        CurrentEnemies[index] = EnemyElement;
    }
}

function ManaChange() {
    percentage = document.querySelector("#mana .current").innerText / 5 * 100;
    document.getElementById("mana-container").style.backgroundColor = `linear-gradient(90deg, rgba(85, 85, 255, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
    document.getElementById("mana-current-player").innerText = document.querySelector("#mana .current").innerText;
}