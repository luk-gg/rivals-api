import { mapKeys, sp } from "./utils"
import locres from "../../game/client/Content/Localization/Game/zh-Hans/Game.json"

// import MarvelHeroTable from "../../game/client/Content/Marvel/Data/DataTable/MarvelHeroTable.json" // basic hero information, and links to relevant files

// import HeroUIAssetTable from "../../game/client/Content/Marvel/Data/DataTable/UI/HeroUIAssetTable.json" // links hero ability IDs to input type & preview videos

// import HeroAbilities from "../../game/client/Content/Marvel/AbilitySystem/1011/1011_Table/1011_AbilityTable.uasset" // Per-character table of abilities, including cooldown, input key

const abilitiesFiles = Object.entries(import.meta.glob("../../game/client/Content/Marvel/AbilitySystem/**/**/*_AbilityTable.json", { import: "default", eager: true }))

export default abilitiesFiles.flatMap(([path, data]) => {
    const heroId = parseInt(path.split("/")[7])

    const abilitiesInFile = Object.values(data[0].Rows)
        .map(ability => {
            return {
                heroId,
                ...mapKeys(ability, {
                    ActivateInput: "input",
                    AbilityCD: "cooldown",
                    AbilityCDID: "cooldownId",
                    // AbilityAsset links to the ability file, i.e. 101102.json
                    AbilityTags: "tags",
                    bSaveCDInPlayerState: "isCooldownSavedToPlayerState",
                    bSharedCDInTeam: "isTeamSharedCooldown",
                    bKeepCDWhenReborn: "isMaintainCooldownAfterRevive",
                    MaxChargeCount: "maxCharges",
                    ChargeAutoRemove: "chargeAutoRemove", // ??
                    ChargeInterval: "chargeInterval",
                    TName: ["name", ({ TableId, Key }) => TableId && locres[sp(TableId, ".")] ? locres[sp(TableId, ".")][Key] : null]
                }),
                ...ability
            }
        })

    return abilitiesInFile
})