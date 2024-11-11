import UIHeroTable from "../../game/client/Content/Marvel/Data/DataTable/HeroGallery/UIHeroTable.json"
// import MarvelHeroStatisticsTable from "../../game/client/Content/Marvel/Data/DataTable/MarvelHeroStatisticsTable.json" // Contains career progress tracked stats (kills with X skill, etc.)
import UIHeroStoryTable from "../../game/client/Content/Marvel/Data/DataTable/UI/HeroSkin/UIHeroStoryTable.json"
// import UIHeroMVPTable from "../../game/client/Content/Marvel/Data/DataTable/UI/HeroSkin/UIHeroMVPTable.json" // Looks like a spray/sticker and some animation for getting MVP? idk
import { imgPath, sp, mapKeys } from "./utils"
import locres from "../../game/client/Content/Localization/Game/zh-Hans/Game.json"

// TODO: hero team-up abilities (HeroBond/Collab?)
// TODO: hero skills (damage etc.)
// TODO: achievements

// 115_Task_1011_ST tasks/quests, maybe for battle pass dailies?
// 118_Career_1011_ST has some career stats for characters?
// 122_HeroVoice_1011_ST voice lines
// 123_Customize_1011_ST skin desc
// 311_SkillCombo_1011_ST
// 604_Ability_1011_ST

// Each object in UIHeroTable is a "Shape". Shape refers to a variant of a hero, i.e. Bruce Banner, Hero Hulk, Monster Hulk. Few characters have more than one shape. Only get UNIQUE characters by moving variant shapes (Hero Hulk, Monster Hulk) into the original shape (Bruce Banner) data.
const uniqueCharacters = Object.entries(UIHeroTable[0].Rows)
    .reduce((acc, [key, shapeData]) => {
        const basicData = mapKeys(shapeData, {
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

        const lore = mapKeys(UIHeroStoryTable[0].Rows[key], {
            Biography_: ["bio", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
            Story_: ["story", (storiesArr) => storiesArr.map((storyObj) =>
                mapKeys(storyObj, {
                    Title_: ["title", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
                    Content_: ["content", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
                    IsUnlocked_: "isUnlocked",
                    UnlockCondition_: ["unlockHint", ({ TableId, Key }) => TableId ? locres[sp(TableId, ".")][Key] : null],
                }))
            ]
        })

        const hero = {
            ...basicData,
            shapeKey: key,
            ...lore
        }

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