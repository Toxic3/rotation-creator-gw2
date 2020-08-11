var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function dataImportation(accessToken, charName) {
    var formattedCharName = formatCharName(charName);
    var charInfo = JSON.parse(sendReq("characters/" + formattedCharName + "?access_token=" + accessToken));
    var charWeaponSet = obtainWeaponSet(charInfo.equipment);
    var charStats = obtainStats(charInfo.equipment);
    var charProfession = JSON.parse(sendReq("professions/" + charInfo.profession));
    var skillSet = obtainSkillSet(charProfession, charWeaponSet, charInfo);
    return {charInfo: charInfo, charWeaponSet: charWeaponSet, charStats: charStats, skillSet: skillSet};
}

function sendReq(endUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.guildwars2.com/v2/" + endUrl, false);
    xhttp.send();
    var response = xhttp.responseText;
    xhttp.abort();
    return response;
}

function formatCharName(charName) {
    var finalString = "";
    for (var i = 0; i < charName.length; i++) {
        if (charName[i] === " ") finalString += "%20";
        else finalString += charName[i];
    }
    return finalString;
}

function obtainWeaponSet(equipment) {
    var weaponSet = new Array(4);
    for (var i = 0; i < equipment.length; i++) {
        if (equipment[i].slot === 'WeaponA1') {weaponSet[0] = JSON.parse(sendReq("items/" + equipment[i].id)).details.type;}
        else if (equipment[i].slot === 'WeaponA2') {weaponSet[1] = JSON.parse(sendReq("items/" + equipment[i].id)).details.type;}
        else if (equipment[i].slot === 'WeaponB1') {weaponSet[2] = JSON.parse(sendReq("items/" + equipment[i].id)).details.type;}
        else if (equipment[i].slot === 'WeaponB2') {weaponSet[3] = JSON.parse(sendReq("items/" + equipment[i].id)).details.type;}
    }
    return weaponSet;
}

function obtainStats(charInfo) {
    var statNames = ["Power","Precision","Toughness","Vitality","BoonDuration",
    "ConditionDamage","ConditionDuration","CritDamage","Healing"];
    var statWeapon1 = {
        Power: 1000,
        Precision: 1000,
        Toughness: 1000,
        Vitality: 1000,
        BoonDuration: 0,
        ConditionDamage: 0,
        ConditionDuration: 0,
        CritDamage: 0,
        Healing: 0,
        AgonyResistance: 0
    };
    for (var i = 0; i < charInfo.length; i++) {
        if (charInfo[i].slot !== "HelmAquatic" && charInfo[i].slot !== "WeaponAquaticA" && charInfo[i].slot !== "WeaponAquaticB"
        && charInfo[i].slot !== "Sickle" && charInfo[i].slot !== "Axe" && charInfo[i].slot !== "Pick"
        && charInfo[i].slot !== "WeaponB1" && charInfo[i].slot !== "WeaponB2") {
            if (charInfo[i].infusions) {
                for (var k = 0; k < charInfo[i].infusions.length; k++) {
                    var infusionInfo = JSON.parse(sendReq("items/" + charInfo[i].infusions[k])).details.infix_upgrade;
                    if (infusionInfo !== undefined) {
                        for (var l = 0; l < infusionInfo.attributes.length; l++) {
                            statWeapon1[infusionInfo.attributes[l].attribute] += infusionInfo.attributes[l].modifier;
                        }
                    }
                }
            }
            if (charInfo[i].stats) {
                for (var j = 0; j < statNames.length; j++) {
                    if (charInfo[i].stats.attributes[statNames[j]]) {
                        statWeapon1[statNames[j]] += charInfo[i].stats.attributes[statNames[j]];
                    }
                }
            } else {
                var equipInfo = JSON.parse(sendReq("items/" + charInfo[i].id)).details.infix_upgrade;
                if (equipInfo !== undefined) {
                    for (var j = 0; j < equipInfo.attributes.length; j++) {
                        statWeapon1[equipInfo.attributes[j].attribute] += equipInfo.attributes[j].modifier;
                    }
                } else continue;
            }
        }
    }
    var statWeapon2 = {
        Power: 1000,
        Precision: 1000,
        Toughness: 1000,
        Vitality: 1000,
        BoonDuration: 0,
        ConditionDamage: 0,
        ConditionDuration: 0,
        CritDamage: 0,
        Healing: 0,
        AgonyResistance: 0
    };
    var equipmentUpgrades = [];
    for (var i = 0; i < charInfo.length; i++) {
        if (charInfo[i].upgrades) {
            for (var j = 0; j < charInfo[i].upgrades.length; j++) {
                var upgradeBool = true;
                for (var k = 0; k < equipmentUpgrades.length; k++) {
                    if (equipmentUpgrades[k].id === charInfo[i].upgrades[j]) {
                        equipmentUpgrades[k].value += 1;
                        upgradeBool = false;
                    }
                }
                if (upgradeBool) {
                    equipmentUpgrades.push({id: charInfo[i].upgrades[j], value: 1});
                }
            }
        }
        if (charInfo[i].slot !== "HelmAquatic" && charInfo[i].slot !== "WeaponAquaticA" && charInfo[i].slot !== "WeaponAquaticB" 
        && charInfo[i].slot !== "Sickle" && charInfo[i].slot !== "Axe" && charInfo[i].slot !== "Pick" &&
        charInfo[i].slot !== "WeaponA1" && charInfo[i].slot !== "WeaponA2") {
            if (charInfo[i].infusions) {
                for (var k = 0; k < charInfo[i].infusions.length; k++) {
                    var infusionInfo = JSON.parse(sendReq("items/" + charInfo[i].infusions[k])).details.infix_upgrade;
                    if (infusionInfo !== undefined) {
                        for (var l = 0; l < infusionInfo.attributes.length; l++) {
                            statWeapon2[infusionInfo.attributes[l].attribute] += infusionInfo.attributes[l].modifier;
                        }
                    }
                }
            }
            if (charInfo[i].stats) {
                for (var j = 0; j < statNames.length; j++) {
                    if (charInfo[i].stats.attributes[statNames[j]]) {
                        statWeapon2[statNames[j]] += charInfo[i].stats.attributes[statNames[j]];
                    }
                }
            } else {
                var equipInfo = JSON.parse(sendReq("items/" + charInfo[i].id)).details.infix_upgrade;
                if (equipInfo !== undefined) {
                    for (var j = 0; j < equipInfo.attributes.length; j++) {
                        statWeapon2[equipInfo.attributes[j].attribute] += equipInfo.attributes[j].modifier;
                    }
                } else continue;
            }
        }
    }
    return {statWeapon1: statWeapon1, statWeapon2: statWeapon2, equipmentUpgrades: equipmentUpgrades};
}

function obtainSkillSet(profession, weaponSet, charInfo) {
    for (var i = 0; i < weaponSet.length; i++) {
        if (weaponSet[i] === "LongBow") weaponSet[i] = "Longbow";
        else if (weaponSet[i] === "ShortBow") weaponSet[i] = "Shortbow";
    }
    var skillSet = new Array(15);
    if (weaponSet[0]) {
        var weapon1TwoHanded = false;
        for (var i = 0; i < profession.weapons[weaponSet[0]].flags.length; i++) {
            if (profession.weapons[weaponSet[0]].flags[i] === "TwoHand") {
                weapon1TwoHanded = true;
                break;
            }
        }
    }
    if (weaponSet[2]) {
        var weapon2TwoHanded = false;
        for (var i = 0; i < profession.weapons[weaponSet[2]].flags.length; i++) {
            if (profession.weapons[weaponSet[2]].flags[i] === "TwoHand") {
                weapon2TwoHanded = true;
                break;
            }
        }
    }
    for (var i = 0; i < 15; i++) {
        if (i >= 0 && i < 3) {
            // Set 1 first 3
            // Situations:
            // 1. Weapon 0 exists
            // 2. Weapon 2 is one handed
            // 3. Weapon 2 is two handed and no weapon 1

            // 1
            if (weaponSet[0]) skillSet = skillRequests(profession, weaponSet, 0, i, skillSet, 0);
            else if (weaponSet[2]) {
                // 2
                if (weapon2TwoHanded === false) {
                    skillSet = skillRequests(profession, weaponSet, 2, i, skillSet, 0);
                }
                // 3
                else {
                    if (weaponSet[1]) continue;
                    else skillSet = skillRequests(profession, weaponSet, 2, i, skillSet, 0);
                }
            }
        } else if (i >= 3 && i < 5) {
            // Set 1 last 2
            // Situations:
            // 1. Weapon 1 exists
            // 2. Weapon 0 is two handed
            // 3. Weapon 3 exists
            // 4. Weapon 0 doesn't exist and 2 is two handed
            
            if (weaponSet[1]) { // 1
                skillSet = skillRequests(profession, weaponSet, 1, i, skillSet, 0);
            } else if (weaponSet[0] && weapon1TwoHanded) { // 2
                skillSet = skillRequests(profession, weaponSet, 0, i, skillSet, 0);
            } else if (weaponSet[3]) { // 3
                skillSet = skillRequests(profession, weaponSet, 3, i, skillSet, 0);
            } else if (weaponSet[0] === undefined && weapon2TwoHanded) { // 4
                skillSet = skillRequests(profession, weaponSet, 2, i, skillSet, 0);
            }
        } else if (i >= 5 && i < 8) {
            // Set 2 first 3
            // Situations:
            // 1. Weapon 2 exists
            // 2. Weapon 0 is one handed
            // 3. Weapon 0 is two handed and no weapon 3
            
            // 1
            if (weaponSet[2]) skillSet = skillRequests(profession, weaponSet, 2, i, skillSet, 5);
            else if (weaponSet[0]) {
                // 2
                if (weapon1TwoHanded === false) {
                    skillSet = skillRequests(profession, weaponSet, 0, i, skillSet, 5);
                }
                // 3
                else {
                    if (weaponSet[3]) continue;
                    else skillSet = skillRequests(profession, weaponSet, 0, i, skillSet, 5);
                }
            }
        } else if (i >= 8 && i < 10) {
            // Set 2 last 2
            // Situations:
            // 1. Weapon 3 exists
            // 2. Weapon 2 is two handed
            // 3. Weapon 1 exists
            // 4. Weapon 2 doesn't exist and 0 is two handed
            
            if (weaponSet[3]) {
                skillSet = skillRequests(profession, weaponSet, 3, i, skillSet, 5);
            } else if (weaponSet[2] && weapon2TwoHanded) {
                skillSet = skillRequests(profession, weaponSet, 2, i, skillSet, 5);
            } else if (weaponSet[1]) {
                skillSet = skillRequests(profession, weaponSet, 1, i, skillSet, 5);
            } else if (weaponSet[2] === undefined && weapon1TwoHanded) {
                skillSet = skillRequests(profession, weaponSet, 0, i, skillSet, 5);
            }
        } else if (i === 10) {
            skillSet[i] = charInfo.skills.pve.heal;
        } else if (i >= 11 && i < 14) {
            skillSet[i] = charInfo.skills.pve.utilities[i-11];
        } else {
            skillSet[i] = charInfo.skills.pve.elite;
        }
    }
    return skillSet;
}

function skillRequests(profession, weaponSet, weaponNum, i, skillSet, num) {
    for (var j = 0; j < profession.weapons[weaponSet[weaponNum]].skills.length; j++) {
        if (profession.weapons[weaponSet[weaponNum]].skills[j].slot === "Weapon_" + (i-num+1)) {
            if (skillSet[i]) {
                skillSet[i].push(profession.weapons[weaponSet[weaponNum]].skills[j].id);
            } else {
                skillSet[i] = [profession.weapons[weaponSet[weaponNum]].skills[j].id];
            }
        }
    }
    return skillSet;
}

function positiveMultCalc(charProfession, charInfo) {
    console.log(charInfo);
}

module.exports.dataImportation = dataImportation;
module.exports.sendReq = sendReq;