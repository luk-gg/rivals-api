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
            const {
                AbilityID,
                HeroName,
                TName,
                ActivateInput,
                AbilityCD,
                AbilityCDID, // not sure how this is used; maybe for CDs that can be reset/reduced with certain actions such as Psylocke
                AbilityAsset, // links to the ability's specific file, i.e. 101102.json
                AbilityTags, // "Jump", "Bond", "Passive" tags etc.
                bSaveCDInPlayerState,
                bSharedCDInTeam,
                bKeepCDWhenReborn,
                MaxChargeCount,
                ChargeAutoRemove, // unsure
                ChargeInterval,
                bCacheSkill,
                QuoteBuff, // some sort of object for buffs?
                Description,
                AbilityLogTags, // "UltimateAbility" tags etc.
                AbilityRedirectLog, // Career stat logging (Gamma Storm total kills etc.)
                AbilityLog, // Career stats (ZiplineSlideDistance, RespawnCnt)
                BuffLog, // list of buffs it applies? just has BuffID
                ForbiddenAbilityBaseLog, // unsure, always empty
                ToRecordEffectIDs, // some sort of logging "EffectType": "EMarvelEffectType::Scope"
                AbilityStatisticsClass, // stats tracking? folder doesnt exist in fmodel
                AbilityExtraStatisticsClass, // stats tracking? folder doesnt exist in fmodel
                DamageTypeClass, // Low or High destruction damage
                ImpulseLevelInfo, // unsure
                ImpulseApplyFilter, // unsure
                BeHitAnimConfigID, // unsure
                AbilityUITags, // Normal, Melee, Weapon, Ultimate
            } = ability

            let name = null;
            if (TName.TableId && locres[sp(TName.TableId, ".")]) {
                name = locres[sp(TName.TableId, ".")][TName.Key]
            }

            let desc = null;
            if (Description.TableId && locres[sp(Description.TableId, ".")]) {
                desc = locres[sp(Description.TableId, ".")][Description.Key]
            }

            return {
                heroId,
                name,
                desc,
                AbilityID,
                HeroName,
                ActivateInput,
                AbilityCD,
                AbilityCDID,
                AbilityAsset,
                AbilityTags,
                bSaveCDInPlayerState,
                bSharedCDInTeam,
                bKeepCDWhenReborn,
                MaxChargeCount,
                ChargeAutoRemove,
                ChargeInterval,
                bCacheSkill,
                QuoteBuff,
                AbilityLogTags,
                AbilityRedirectLog,
                AbilityLog,
                BuffLog,
                ForbiddenAbilityBaseLog,
                ToRecordEffectIDs,
                AbilityStatisticsClass,
                AbilityExtraStatisticsClass,
                DamageTypeClass,
                ImpulseLevelInfo,
                ImpulseApplyFilter,
                BeHitAnimConfigID,
                AbilityUITags,
                // ...ability
            }
        })

    return abilitiesInFile
})