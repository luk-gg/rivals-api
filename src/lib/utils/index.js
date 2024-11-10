import fs from "fs"

// Uses linear interpolation to incrementally add missing values to an UnrealEngine array of [{ Time, Value }] objects and return them as [{ x, y }]
export function RCIM_Linear(arr) {
    return arr.reduce((acc, curr, index) => {
        let { Time: x0, Value: y0 } = curr
        const { Time: x1, Value: y1 } = arr[index + 1] || {}

        // Push the current value from the original array
        acc.push({ x: x0, y: y0 })

        // Fill in missing values from the current Time to the next Time
        let missingX = x0
        while (x1 > missingX + 1) {
            missingX++
            const missingY = y0 + (y1 - y0) * ((missingX - x0) / (x1 - x0))
            acc.push({ x: missingX, y: missingY })
        }

        return acc
    }, [])
}

export function imgPath(path) {
    if (!path) return
    return path.replace("/Game", "/Content").split(".")[0] + ".png"
}

// Shrinks each entries[] object to only have the necessary keys for displaying in a list, i.e. name and icon.
export function getBriefArr(arr) {
    return arr.map(data => getBriefData(data))
}

export function getBriefData(fullData) {
    const { id, name, icon } = fullData || {}
    return { id, name, icon }
}

// Ensure case-insensitivity as svelte's routing (or the browser?) transforms links like /Characters/UCR001 to /characters/ucr001. 
export function writeJson(dir, fileName, data) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${fileName.toLowerCase()}.json`, JSON.stringify(data))
}

// Split-pop function for removing Unreal Engine variable types, i.e. "ESkillType::Attack" → "Attack".
export const sp = (str, delimiter = "::") => str.split(delimiter).pop()

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