

function calcDmgVal(splOrder, spl) {
    for (var i = 0; i < splOrder.length; i++) {
        spl[splOrder[i]].damageVal = Math.floor(spl[splOrder[i]].damage / spl[splOrder[i]].castTime);
    }
    return spl;
}

function rc(splOrder, spl) {
    var damage = 0;
    var duration = 0;
    var order = [];
    while (damage < 200000) {
        for (var i = 0; i < splOrder.length; i++) {
            if (spl[splOrder[i]].intCD >= spl[splOrder[i]].CD) {
                order.push(splOrder[i]);
                damage += spl[splOrder[i]].damage;
                var castTime = spl[splOrder[i]].castTime;
                duration += castTime;
                for (var j = 0; j < splOrder.length; j++) {
                    spl[splOrder[j]].intCD += castTime;
                }
                spl[splOrder[i]].intCD = 0;
                break;
            }
        }
        for (var j = 0; j < splOrder.length; j++) {
            spl[splOrder[j]].intCD += 0.25;
        }
        duration += 0.25;
    }
    console.log(order, duration);
}

function main() {
    var splOrder = [
    "grenadeBarrage", 
    "blastGyro", 
    "thunderClap",
    "shredderGyro",
    "electroWhirl",
    "spareCapacitor"]
    var spl = {
        grenadeBarrage: {
            damage: 5706,
            castTime: 0.5,
            CD: 25,
            intCD: 999
        },
        blastGyro: {
            damage: 2636,
            castTime: 0.25,
            CD: 25,
            intCD: 999
        },
        thunderClap: {
            damage: 6590,
            castTime: 0.75,
            CD: 24,
            intCD: 999
        },
        shredderGyro: {
            damage: 5700,
            castTime: 0.75,
            CD: 20,
            intCD: 999
        },
        electroWhirl: {
            damage: 3834,
            castTime: 1,
            CD: 6,
            intCD: 999
        },
        spareCapacitor: {
            damage: 1900,
            castTime: 0.5,
            CD: 24,
            intCD: 999
        }
    }
    spl = calcDmgVal(splOrder, spl);
    spl = alacCalc(splOrder, spl);
    rc(splOrder, spl);
}

function alacCalc(splOrder, spl) {
    for (var i = 0; i < splOrder.length; i++) {
        spl[splOrder[i]].CD = Math.floor(spl[splOrder[i]].CD * 0.66);
        spl[splOrder[i]].castTime = Math.floor(spl[splOrder[i]].castTime * 0.66);
    }
    return spl;
}

main();