import UIHeroTable from "../../game/client/Content/Marvel/Data/DataTable/HeroGallery/UIHeroTable.json"
import UIHeroStoryTable from "../../game/client/Content/Marvel/Data/DataTable/UI/HeroSkin/UIHeroStoryTable.json"
import { imgPath, sp, mapKeys } from "./utils"
import locres from "../../game/client/Content/Localization/Game/zh-Hans/Game.json"

// TODO: hero team-up abilities (HeroBond/Collab?)
// TODO: hero skills
// TODO: hero names
// TODO: hero poses
// TODO: hero nameplates
// TODO: hero mvp table?
// TODO: hero spray
// TODO: hero story
// TODO: hero skins

// Each object in UIHeroTable is a "Shape". Shape refers to a variant of a hero, i.e. Bruce Banner, Hero Hulk, Monster Hulk. Few characters have more than one shape. Only get UNIQUE characters by moving variant shapes (Hero Hulk, Monster Hulk) into the original shape (Bruce Banner) data.
const uniqueCharacters = Object.entries(UIHeroTable[0].Rows)
    .reduce((acc, [key, shapeData]) => {
        const hero = mapKeys(shapeData, {
            HeroID_: "id",
            ShapeID_: "shapeId",
            HeroName_: "heroName",
            HeroBasic_: {
                RealName_: ["realName", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
                EnName_: "enName",
                Role_: ["role", (role) => locres["607_HeroData_ST"][`HeroRole_${sp(role)}`]],
                Somatotype_: ["somatotype", (som) => sp(som)],
                Team_: ["categories", (cats) => cats.map(cat => sp(cat))],
                Difficult_: "difficulty",
                Desc_: ["desc", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
                HeroInfoMainColor_: ["color", (clrObj) => `#${clrObj.Hex}`]
            },
            HeroHead_: {
                HeroHeadBig_: {
                    Image_: ["icon", ({ AssetPathName }) => imgPath(AssetPathName)]
                }
            }
        })
        // Skill icon when hero bond is activated: HeroBond_112_153B26FB4FB57DFDEFD2BDA1EBCE8B80
        hero.shapeKey = key

        if (!acc[hero.id]) {
            acc[hero.id] = hero
        }
        else {
            if (!acc[hero.id].variants) acc[hero.id].variants = []
            acc[hero.id].variants.push(hero)
        }
        return acc
    }, {})

const characters = Object.values(uniqueCharacters)

export default characters