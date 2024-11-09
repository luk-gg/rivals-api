Models: `/Marvel/Characters/CHARID/CHARSKINID/Meshes/SK_CHARID_CHARSKINID.uasset`
Char DB: `/Marvel/Content/Marvel/Data/DataTable/MarvelFreeHeroTable.uasset`
Pity drop rates?: `/Marvel/Content/Marvel/Data/DataTable/MarvelGuaranteTable.uasset`
idk: `/Marvel/Content/Marvel/Data/DataTable/MarvelShopTable.uasset`

hero headshot: `/Marvel/Content/Marvel/UI/Textures/HeroPortrait/SelectHero/img_selecthero_1029101.uasset`
hero portrait: `/Marvel/Content/Marvel/UI/Textures/Show/Skin/OriginalSkin/img_heroportrait_10160010_portrait.uasset`

StringTables seem to exist inside of Game.locres. For example, 601_HeroUIAsset_1015_ST.json's data is found inside the Game.locres object "601_HeroUIAsset_1015_ST". Some files also have SourceString and LocalizedString included in them, like UIHeroTable, though it's unknown which source is the correct source or whether they are always the same source and are just added in to their respective files.