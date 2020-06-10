import path = require('path');
import { fs, log, util, selectors } from "vortex-api";
import { IExtensionContext, IDiscoveryResult, IState, ISupportedResult, ProgressDelegate, IInstallResult, IExtensionApi, IGameStoreEntry, IGame } from 'vortex-api/lib/types/api';
import { ProfileClient } from "vortex-ext-common";
import { InstructionType } from 'vortex-api/lib/extensions/mod_management/types/IInstallResult';

import { getGamePath, getUserModsPath, isRedAlertMod, isTiberianMod, isRulesMod } from "./util";

// import { ProfileClient } from "./profileClient";

export const GAME_ID = 'commandandconquerremastered'
export const STEAMAPP_ID = 1213210;
const MOD_FILE = 'ccmod.json';
const RULES_FILE = 'Rules.ini'
const GAME_EXE = 'ClientG.exe';
const LAUNCHER_EXE = 'ClientLauncherG.exe';


let GAME_PATH = '';

export function findGame() {
    return util.GameStoreHelper.findByAppId(STEAMAPP_ID.toString())
      .then((game: IGameStoreEntry) => game.gamePath);
}



//This is the main function Vortex will run when detecting the game extension. 
function main(context : IExtensionContext) {
    const getRulesPath = (game: IGame): string => {
        return getGamePath(context.api, game, false);
    };
    
    context.once(() => {
    });
    context.registerGame({
        name: "Command & Conquer Remastered",
        mergeMods: false,
        logo: 'gameart.png',
        supportedTools: [],
        executable: () => GAME_EXE,
        requiredFiles: [
            GAME_EXE,
            LAUNCHER_EXE,
            'TiberianDawn.dll',
            'RedAlert.dll'
        ],
        id: GAME_ID,
        queryPath: findGame,
        queryModPath: () => getUserModsPath(),
        setup: (discovery: IDiscoveryResult) => {
            log('debug', 'running cncr setup')
            prepareForModding(discovery)
        },
        environment: {
            SteamAPPId: STEAMAPP_ID.toString(),
            gamepath: GAME_PATH
        },
        details: {
            steamAppId: STEAMAPP_ID
        }
    });

    context.registerModType(
        'cncr-tiberian', 
        100, 
        gameId => gameId === GAME_ID, 
        () => getUserModsPath('Tiberian_Dawn'), 
        (inst) => Promise.resolve(isTiberianMod(inst)), 
        { name: "Tiberian Dawn"});
    context.registerModType(
        'cncr-ra', 
        100, 
        gameId => gameId === GAME_ID, 
        () => getUserModsPath('Red_Alert'), 
        (inst) => Promise.resolve(isRedAlertMod(inst)), 
        { name: "Red Alert"});
    context.registerModType(
        'cnc-rules',
        100,
        gameId => gameId === GAME_ID,
        (game) => getRulesPath(game),
        (inst) => Promise.resolve(isRulesMod(inst)),
        { name: "Rules Tweak", mergeMods: true}
    );
    context.registerInstaller(
        'cncr-installer', 
        25, 
        testSupportedContent, 
        installContent
    );

    // addProfileFeatures(context);
    return true
}

/**
 * Preps the C&C Remastered installation for mod deployment.
 * @remarks
 * This just creates the ~/Documents/CnCRemastered/Mods folder right now.
 *
 * @param discovery - The details for the discovered game.
 */
function prepareForModding(discovery : IDiscoveryResult) {
    GAME_PATH = discovery.path;
    return fs.ensureDirWritableAsync(getUserModsPath(),
        () => Promise.resolve());
}

/**
 * Checks if the given mod files can be installed with this extension.
 * @remarks
 * This will currently accept any mod with a `ccmod.json` file.
 *
 * @param files - The list of mod files to test against
 * @param gameId - The current game ID to test against. Short-circuits if not commandandconquerremastered.
 */
function testSupportedContent(files: string[], gameId: string): Promise<ISupportedResult> {
    log('debug', `files: ${files.length} [${files[0]}]`);
    // we only support mods with a `ccmod.json` (not parsed though)
    let supported = (gameId === GAME_ID) &&
        ((files.find(file => path.basename(file).toLowerCase() === MOD_FILE) !== undefined)
        // || (files.find(file => path.basename(file).toLowerCase() === RULES_FILE.toLowerCase()) !== undefined)
        );
    return Promise.resolve({
        supported,
        requiredFiles: [],
    });
}

/**
 * The main extension installer implementation.
 * @remarks
 * The main logic for this was mostly borrowed from agc93/beatvortex and Nexus-Mods/vortex-games so thanks respective authors
 *
 * @param api - The extension API.
 * @param files - The list of mod files for installation
 * @param gameId - The game ID for installation (should only ever be GAME_ID)
 * @param progressDelegate - Delegate for reporting progress (not currently used)
 *
 * @returns Install instructions for mapping mod files to output location.
 */
function installContent(files: string[], destinationPath: string, gameId: string): Promise<IInstallResult> {
    log('debug', `running cncr installer. [${gameId}]`, {files: files, destinationPath});
    //basically need to keep descending until we find a reliable indicator of mod root
    const modFile = files.find(file => path.basename(file).toLowerCase() === MOD_FILE);
    if (modFile) {
        // we found a ccmod.json file, so disregard anything outside of that
        const idx = modFile.indexOf(path.basename(modFile));
        const rootPath = path.dirname(modFile);
        const filtered = files.filter(file => 
            ((file.indexOf(rootPath) !== -1) 
            && (!file.endsWith(path.sep))));
        log('debug', 'filtered extraneous files', { root: rootPath, candidates: filtered });
        const instructions = filtered.map(file => {
            // const destination = file.substr(firstType.indexOf(path.basename(root)) + root.length).replace(/^\\+/g, '');
            const destination = path.join(file.substr(idx));
            return {
                type: 'copy' as InstructionType,
                source: file,
                destination: destination
            }
        });
        log('debug', 'built instructions', {instructions: instructions.length});
        return Promise.resolve({ instructions });
    } else {
        return Promise.reject(util.NotSupportedError);
    }
}


module.exports = {
    default: main,
};