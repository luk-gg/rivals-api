import UIHeroTable from "../../game/client/Content/Marvel/Data/DataTable/HeroGallery/UIHeroTable.json"
import { imgPath } from "./utils"

// TODO: Team-up abilities (HeroBond/Collab?)
// TODO: Character skills

export default Object.entries(UIHeroTable[0].Rows).map(([key, shapeData]) => {
    let id, shapeId, name, desc, icon, enName, difficulty, color, role, somatotype, categories;

    for (const key in shapeData) {
        if (key.startsWith("HeroID_")) id = shapeData[key]
        if (key.startsWith("ShapeID_")) shapeId = shapeData[key]
        if (key.startsWith("HeroName_")) name = shapeData[key]
        if (key.startsWith("HeroBasic_")) {
            for (const deepKey in shapeData[key]) {
                if (deepKey.startsWith("EnName_")) enName = shapeData[key][deepKey]
                if (deepKey.startsWith("Role_")) role = shapeData[key][deepKey].split("::").pop()
                if (deepKey.startsWith("Somatotype_")) somatotype = shapeData[key][deepKey].split("::").pop()
                if (deepKey.startsWith("Team_")) categories = shapeData[key][deepKey].map(cat => cat.split("::").pop())
                if (deepKey.startsWith("Difficult_")) difficulty = shapeData[key][deepKey]
                if (deepKey.startsWith("Desc_")) desc = shapeData[key][deepKey].LocalizedString // Might be incorrect; check against the TableId and Key values.
                if (deepKey.startsWith("HeroInfoMainColor_")) color = `#${shapeData[key][deepKey].Hex}`
            }
        }
        if (key.startsWith("HeroHead_")) {
            for (const deepKey in shapeData[key]) {
                if (deepKey.startsWith("HeroHeadBig_")) {
                    for (const deeperKey in shapeData[key][deepKey]) {
                        if (deeperKey.startsWith("Image_")) icon = imgPath(shapeData[key][deepKey][deeperKey].AssetPathName)
                    }
                }
            }
        }
        // Skill icon when hero bond is activated: HeroBond_112_153B26FB4FB57DFDEFD2BDA1EBCE8B80
    }

    return {
        key,
        id,
        name,
        shapeId,
        icon,
        desc, 
        enName, 
        difficulty, 
        color, 
        role, 
        somatotype, 
        categories,
        // ...shapeData
    }
})