import UIHeroTable from "../../game/client/Content/Marvel/Data/DataTable/HeroGallery/UIHeroTable.json"
import { imgPath } from "./utils"
import locres from "../../game/client/Content/Localization/Game/zh-Hans/Game.json"

// TODO: Team-up abilities (HeroBond/Collab?)
// TODO: Character skills

// Each object in UIHeroTable is a "Shape". Shape refers to a variant of a hero, i.e. Bruce Banner, Hero Hulk, Monster Hulk. Few characters have more than one shape.
function transformCharacterData([key, shapeData]) {
    let hero = {}

    for (const key in shapeData) {
        const value = shapeData[key]
        if (key.startsWith("HeroID_")) hero.id = value
        if (key.startsWith("ShapeID_")) hero.shapeId = value
        if (key.startsWith("HeroName_")) hero.heroName = value

        if (key.startsWith("HeroBasic_")) {
            for (const deepKey in value) {
                const deepValue = value[deepKey]
                if (deepKey.startsWith("RealName_")) {
                    const { TableId, Key } = deepValue
                    if (TableId) {
                        const ns = TableId.split(".").pop()
                        hero.realName = locres[ns][Key]
                    }
                }
                if (deepKey.startsWith("EnName_")) hero.enName = deepValue
                if (deepKey.startsWith("Role_")) hero.role = deepValue.split("::").pop()
                if (deepKey.startsWith("Somatotype_")) hero.somatotype = deepValue.split("::").pop()
                if (deepKey.startsWith("Team_")) hero.categories = deepValue.map(cat => cat.split("::").pop())
                if (deepKey.startsWith("Difficult_")) hero.difficulty = deepValue
                if (deepKey.startsWith("Desc_")) hero.desc = deepValue.LocalizedString // Might be incorrect; check against the TableId and Key values.
                if (deepKey.startsWith("HeroInfoMainColor_")) hero.color = `#${deepValue.Hex}`
            }
        }

        if (key.startsWith("HeroHead_")) {
            for (const deepKey in value) {
                if (deepKey.startsWith("HeroHeadBig_")) {
                    for (const deeperKey in value[deepKey]) {
                        if (deeperKey.startsWith("Image_")) hero.icon = imgPath(value[deepKey][deeperKey].AssetPathName)
                    }
                }
            }
        }
        // Skill icon when hero bond is activated: HeroBond_112_153B26FB4FB57DFDEFD2BDA1EBCE8B80
    }

    hero.shapeKey = key

    return hero
}

// Only get UNIQUE characters by moving variant forms (Hero Hulk, Monster Hulk) into the original hero (Bruce Banner) data.
const uniqueCharacters = Object.entries(UIHeroTable[0].Rows)
    .reduce((acc, rawData) => {
        const character = transformCharacterData(rawData)
        if (!acc[character.id]) {
            acc[character.id] = character
        }
        else {
            if (!acc[character.id].variants) acc[character.id].variants = []
            acc[character.id].variants.push(character)
        }
        return acc
    }, {})

const characters = Object.values(uniqueCharacters)

export default characters