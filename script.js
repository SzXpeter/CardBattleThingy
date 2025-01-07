class Card {
    constructor(Type, Mana, Value, Image, UsableOn, Desc) {
        this.Type = Type;
        this.Mana = Mana;
        this.Value = Value;
        this.Image = Image;
        this.UsableOn = UsableOn;
        this.Desc = Desc;
    }
}
const CardTypes = [
    new Card("Attack", 1, 15, "Pictures/Cards/Attack.png", "Enemy", "<span>kard támadás</span><br><br>15 sebzést okoz"),
    new Card("LightningStrike", 1, 10, "Pictures/Cards/LightningStrike.png", "Enemy", "<span>villám csapás</span><br><br>10 sebzést okoz, ha az ellenség el van kábítva kétszer annyit sebez"),
    new Card("PommelStrike", 0, 5, "Pictures/Cards/PommelStrike.png", "Enemy", "<span>kardgomb csapás</span><br><br>5 sebzést okoz és elkábítja az ellenséget 1 körre(nem stackelődik)"),
    new Card("Heal", 3, 25, "Pictures/Cards/Heal.png", "Player", "<span>gyógítás</span><br><br>25 életerőt gyógyít"),
    new Card("AttackDebuff", 2, 25, "Pictures/Cards/AttackDebuff.png", "Enemy", "<span>támadás gyengítés</span><br><br>Az ellenség 25%-kal kevesebbet sebez örökké"),
    new Card("DefenseDebuff", 2, 50, "Pictures/Cards/DefenseDebuff.png", "Enemy", "<span>védelem gyengítés</span><br><br>Az ellenség 50%-kal több sebzést kap örökké"),
    new Card("AttackUp", 1, 25, "Pictures/Cards/AttackUp.png", "Player", "<span>támadás erősítés</span><br><br>A játékos 25%-kal több sebzést okoz ebben a körben"),
    new Card("DrawCards", 1, 2, "Pictures/Cards/DrawCards.png", "Player", "<span>kártya húzás</span><br><br>2 kártyát húz"),
]

class Enemy {
    constructor(Name, Health, Damage, Image, Desc) {
        this.Name = Name;
        this.Health = Health;
        this.Damage = Damage;
        this.Image = Image;
        this.Desc = Desc;
    }
}
const EnemyTypes = [
    new Enemy("Tank", 150, 5, "Pictures/Tank.png", "5 sebzés, 5 életerő gyógyítás"),
    new Enemy("Assassin", 50, 12, "Pictures/Assassin.png", "12 sebzés"),
    new Enemy("Mage", 100, 8, "Pictures/Mage.png", "8 sebzés"),
    new Enemy("Healer", 100, 15, "Pictures/Healer.png", "15 életerő gyógyítás"),
    new Enemy("Boss", 300, 15, "Pictures/Boss.png", "15 sebzés"),
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

const ManaObserver = new MutationObserver(() => {
    percentage = document.getElementById("mana-current-player").innerText / 5 * 100;
    document.getElementById("mana-container").style.background = `linear-gradient(90deg, rgba(0, 0, 255, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
    document.querySelector("#mana .current").innerText = document.getElementById("mana-current-player").innerText;
});
ManaObserver.observe(document.getElementById("mana-current-player"), { characterData: true, subtree: true, childList: true });

const HealthObserver = new MutationObserver(() => {
    const current = parseFloat(document.getElementById("health-current-player").innerText, 10);
    const max = parseFloat(document.getElementById("health-max-player").innerText, 10);
    const percentage = (current / max) * 100;

    document.querySelector("#hero .hp-container").style.background = `linear-gradient(90deg, rgba(255, 0, 0, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
    document.querySelector("#health .current").innerText = current;
    if (current <= 0) {
        document.getElementById("lose").style.display = "block";
    }
});
HealthObserver.observe(document.getElementById("health-current-player"), { characterData: true, subtree: true, childList: true });

document.getElementById("hero").addEventListener('dragover', DragOver);
document.getElementById("hero").addEventListener('drop', Drop);

function NextRound() {
    const CurrentRound = document.getElementById("current-round").innerText;
    CreateEnemy(Rounds[CurrentRound - 1][0]);
    CreateEnemy(Rounds[CurrentRound - 1][1]);
    CreateEnemy(Rounds[CurrentRound - 1][2]);

    RoundStart();
}

function NextTurn() {
    index = 0;
    CurrentEnemies.forEach(enemy => {
        if (enemy != null) {
            if (!document.getElementById(`enemy${index}`).classList.contains("stunned")) {
                multiplier = 1;
                if (document.getElementById(`enemy${index}`).classList.contains("AttackDebuff"))
                    multiplier *= .75;
                switch (enemy.Name) {
                    case "Tank":
                        document.getElementById("health-current-player").innerText -= EnemyTypes[0].Damage * multiplier;
                        for (i = 0; i < 3; i++) {
                            if (document.getElementById(`health-current-enemy-${i}`) == null) continue;
                            CurrentHealth = document.getElementById(`health-current-enemy-${i}`);
                            MaxHealth = document.getElementById(`health-max-enemy-${i}`);
                            if (parseFloat(CurrentHealth.innerText) + 5 <= MaxHealth.innerText)
                                CurrentHealth.innerText = parseFloat(CurrentHealth.innerText) + 5;
                            else if (CurrentHealth.innerText < MaxHealth.innerText)
                                CurrentHealth.innerText = MaxHealth.innerText;
                        }
                        break;
                    case "Assassin":
                        document.getElementById("health-current-player").innerText -= EnemyTypes[1].Damage * multiplier;
                        break;
                    case "Mage":
                        document.getElementById("health-current-player").innerText -= EnemyTypes[2].Damage * multiplier;
                        break;
                    case "Healer":
                        CurrentHealth = document.getElementById(`health-current-enemy-0`);
                        MaxHealth = document.getElementById(`health-max-enemy-0`);
                        if (document.getElementById(`health-current-enemy-0`) == null || MaxHealth == CurrentHealth) break;
                        if (parseFloat(CurrentHealth.innerText) + 15 <= MaxHealth.innerText)
                            CurrentHealth.innerText = parseFloat(CurrentHealth.innerText) + 15;
                        else
                            CurrentHealth.innerText = MaxHealth.innerText;
                        break;
                    case "Boss":
                        document.getElementById("health-current-player").innerText -= EnemyTypes[4].Damage * multiplier;
                        break;
                    default:
                        break;
                }
            }
            else
            {
                document.querySelector(`#enemy${index} .stun`).style.display = "none";
                document.getElementById(`enemy${index}`).classList.remove("stunned");
            }
        }
        index++;
    });

    RoundStart();
}

function RandomCard() {
    rand = Math.floor(Math.random() * 100);

    if (rand < 25)
        return CardTypes[0];
    else if (rand < 45)
        return CardTypes[1];
    else if (rand < 60)
        return CardTypes[2];
    else if (rand < 70)
        return CardTypes[3];
    else if (rand < 77)
        return CardTypes[4];
    else if (rand < 84)
        return CardTypes[5];
    else if (rand < 94)
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

    CardElement.addEventListener('dragstart', function () {
        event.dataTransfer.setData('text/plain', event.target.dataset.type);
        event.dataTransfer.setData('dataType', event.target.dataset.cardType);
        event.dataTransfer.setData('id', event.target.id);
    });
    CardElement.addEventListener('drag', function () {
        CardElement.style.display = "none";
    });
    CardElement.addEventListener('dragend', function () {
        CardElement.style.display = "inline";
    });
    CardElement.addEventListener('animationend', function () {
        CardElement.style.animation = "none";
    });
    CardElement.addEventListener('mouseenter', function () {
        CardElement.style.zIndex = "100";
    });
    CardElement.addEventListener('mouseout', function () {
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
        card.style.margin = `0 -${num * 5}px`
    });

}

function CreateEnemy(enemy) {
    const index = FirstFreeIndex(CurrentEnemies);
    if (index == -1)
        return;

    const EnemyElement = document.createElement("div");
    EnemyElement.id = "enemy" + index;
    EnemyElement.classList.add("enemy");;
    EnemyElement.dataset.enemyType = enemy.Name;
    EnemyElement.dataset.accept = "Enemy";
    EnemyElement.dataset.index = index;

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
    const Effects = document.createElement("p");
    Effects.innerHTML = "<br><span class='stun'><br>Elkábítva</span><span class='AttackDB'><br>Támadás gyengítve</span><span class='DefenseDB'><br>Védelem gyengítve</span>";
    Intentions.innerHTML += Effects.innerHTML;
    Intentions.classList.add("intentions");
    EnemyElement.appendChild(Intentions);

    // Add MutationObserver for CurrentHealth changes
    const observer = new MutationObserver(() => {
        const current = parseFloat(document.getElementById(CurrentHealth.id).innerText, 10);
        const max = parseFloat(document.getElementById(MaxHealth.id).innerText, 10);
        const percentage = (current / max) * 100;

        health.style.background = `linear-gradient(90deg, rgba(255, 0, 0, 1) ${percentage}%, rgba(100, 100, 100, 0.5) ${percentage}%)`;
        document.getElementById(EnemyElement.id).style.animation = "none";
        document.getElementById(EnemyElement.id).style.animation = "shake 0.2s";

        if (current <= 0) {
            document.getElementById(EnemyElement.id).remove();
            CurrentEnemies[index] = null;

            if (CurrentEnemies[0] == null && CurrentEnemies[1] == null && CurrentEnemies[2] == null) {
                CurrentRound = document.getElementById("current-round")
                if (CurrentRound.innerText == 3)
                    document.getElementById("win").style.display = "block";
                else {
                    CurrentRound.innerText = parseFloat(CurrentRound.innerText) + 1;
                    NextRound();
                }
            }
        }
    });
    observer.observe(health, { characterData: true, subtree: true, childList: true });

    const image = document.createElement("img");
    image.src = enemy.Image;
    EnemyElement.appendChild(image);

    EnemyElement.addEventListener('animationend', function () {
        document.getElementById(EnemyElement.id).style.animation = "none";
    });
    // EnemyElement.addEventListener('mouseenter', function() {
    //     document.getElementById(CurrentHealth.id).innerText = parseFloat(document.getElementById(CurrentHealth.id).innerText) - 10;
    // });
    EnemyElement.addEventListener('dragover', DragOver);
    EnemyElement.addEventListener('drop', Drop);

    Enemies.appendChild(EnemyElement);
    CurrentEnemies[index] = enemy;
}

function DragOver(event) {
    const draggedType = event.dataTransfer.getData('text/plain');
    const acceptType = event.target.dataset.accept;

    if (draggedType == acceptType) {
        event.preventDefault();
    }
}

function Drop(event) {
    event.preventDefault();
    const DraggedType = event.dataTransfer.getData('text/plain');
    const CardType = event.dataTransfer.getData('dataType');
    const DraggedId = event.dataTransfer.getData('id');
    if (DraggedType != event.target.dataset.accept) return;
    bShouldRemove = true;

    if (DraggedType == "Enemy") {
        const Target = document.getElementById(event.target.id);
        const TargetIndex = Target.dataset.index;
        const TargetHealth = document.getElementById(`health-current-enemy-${TargetIndex}`);

        multiplier = 1;
        if (Target.classList.contains("DefenseDebuff"))
            multiplier *= 1.5;
        if (document.getElementById("hero").classList.contains("AttackUp"))
            multiplier *= 1.25;

        switch (CardType) {
            case "Attack":
                if (ManaDrain(CardTypes[0].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                TargetHealth.innerText = parseFloat(TargetHealth.innerText) - CardTypes[0].Value * multiplier;
                break;
            case "LightningStrike":
                if (ManaDrain(CardTypes[1].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                if (Target.classList.contains("stunned"))
                    TargetHealth.innerText = parseFloat(TargetHealth.innerText) - CardTypes[1].Value * 2 * multiplier;
                else
                    TargetHealth.innerText = parseFloat(TargetHealth.innerText) - CardTypes[1].Value * multiplier;
                break;
            case "PommelStrike":
                if (ManaDrain(CardTypes[2].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                if (!Target.classList.contains("stunned"))
                {
                    Target.classList.add("stunned");
                    document.querySelector(`#${event.target.id} .stun`).style.display = "inline";
                }
                TargetHealth.innerText = parseFloat(TargetHealth.innerText) - CardTypes[2].Value * multiplier;
                break;
            case "AttackDebuff":
                if (ManaDrain(CardTypes[4].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                if (!Target.classList.contains("AttackDebuff"))
                {
                    document.querySelector(`#${event.target.id} .AttackDB`).style.display = "inline";
                    Target.classList.add("AttackDebuff");
                }
                break;
            case "DefenseDebuff":
                if (ManaDrain(CardTypes[5].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                if (!Target.classList.contains("DefenseDebuff"))
                {
                    document.querySelector(`#${event.target.id} .DefenseDB`).style.display = "inline";
                    Target.classList.add("DefenseDebuff");
                }
                break;
            default:
                break;
        }
    }
    else {
        const Target = document.getElementById("hero");

        switch (CardType) {
            case "Heal":
                const MaxHealth = document.getElementById("health-max-player");
                const TargetHealth = document.getElementById("health-current-player");
                if (TargetHealth.innerText == MaxHealth.innerText || ManaDrain(CardTypes[3].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                console.log("Heal")
                if (parseFloat(TargetHealth.innerText) + CardTypes[3].Value <= MaxHealth.innerText)
                    TargetHealth.innerText = parseFloat(TargetHealth.innerText) + CardTypes[3].Value;
                else {
                    console.log("fuck");
                    TargetHealth.innerText = MaxHealth.innerText;
                }
                break;
            case "AttackUp":
                if (ManaDrain(CardTypes[6].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                console.log("AUp")
                if (!Target.classList.contains("AttackUp"))
                    Target.classList.add("AttackUp");
                break;
            case "DrawCards":
                if (ManaDrain(CardTypes[7].Mana) == null) {
                    bShouldRemove = false;
                    break;
                }
                console.log("Cards")
                CreateCard(RandomCard());
                CreateCard(RandomCard());
                break;

            default:
                break;
        }
    }

    if (bShouldRemove) {

        document.getElementById(DraggedId).remove();
        CurrentHand[DraggedId[5]] = null;
    }
}

function RoundStart() {
    document.getElementById("mana-current-player").innerText = 5;
    const Target = document.getElementById("hero");

    if (Target.classList.contains("AttackUp"))
        Target.classList.remove("AttackUp");

    for (i = 0; i < CurrentHand.length; i++) {
        if (CurrentHand[i] != null) {
            document.getElementById(`card-${i}`).remove();
        }
        CurrentHand[i] = null;
    }

    for (i = 0; i < 5; i++)
        CreateCard(RandomCard());
}

function ManaDrain(Amount) {
    const ManaBar = document.getElementById("mana-current-player");

    if (ManaBar.innerText - Amount < 0)
        return null;
    else
        ManaBar.innerText -= Amount;
    return "nothing";
}