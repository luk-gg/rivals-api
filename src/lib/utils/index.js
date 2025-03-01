export function getBriefArr(arr) {
    return arr.map(data => getBriefData(data))
}

export function getBriefData(fullData) {
    const { id, name, icon } = fullData || {}
    return { id, name, icon }
}

// MAYBE MOVE THIS TO API-UTILS
// Take an original uasset object where the keys include random numbers, and find the data and assign it to the new keys provided in the object "maps". 
// HeroID_: "id" → find the key that starts with "HeroID_" and return its value under key "id"
// HeroName_: ["heroName", (name) => name + " Hello"] → find the key that starts with "HeroName_" and return its value under key "heroName" after appending " Hello" to the end.
// HeroBasic_: { EnName_: "enName" } → finds the key that starts with "HeroBasic_" and searches the contents of the value (object) for a key "EnName_" and returns its value under key "enName".
export function mapKeys(obj, maps) {
    let res = {}
    for (const oldKey in obj) {
        for (const [oldKeyPrefix, newKey] of Object.entries(maps)) {
            if (oldKey.startsWith(oldKeyPrefix)) {

                if (Array.isArray(newKey)) {
                    const [key, callback] = newKey
                    res[key] = callback(obj[oldKey])
                }

                else if (typeof newKey === "string") {
                    res[newKey] = obj[oldKey]
                }

                else if (typeof newKey === "object") {
                    res = { ...res, ...mapKeys(obj[oldKey], newKey) }
                }

                // Since the keyPrefix was found, remove this entry so that it isn't visited again for other keys
                delete maps[oldKeyPrefix]
            }
        }
    }
    return res
}