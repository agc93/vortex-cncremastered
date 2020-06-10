import path = require('path');
import { IInstruction, IExtensionApi, IGame } from "vortex-api/lib/types/api";
import { remote } from 'electron';

export function isTiberianMod(files: string[]) : boolean
export function isTiberianMod(instructions: IInstruction[]) : boolean
export function isTiberianMod(filesOrInstructions: string[]|IInstruction[]) : boolean {
    let files: string[] = (typeof filesOrInstructions[0] !== 'string')
        ? (filesOrInstructions as IInstruction[]).map(i => i.source)
        : filesOrInstructions as string[];
    return files.some(f => path.basename(f) == 'TiberianDawn.dll');
}

export function isRedAlertMod(files: string[]) : boolean
export function isRedAlertMod(instructions: IInstruction[]) : boolean
export function isRedAlertMod(filesOrInstructions: string[]|IInstruction[]) : boolean {
    let files: string[] = (typeof filesOrInstructions[0] !== 'string')
        ? (filesOrInstructions as IInstruction[]).map(i => i.source)
        : filesOrInstructions as string[];
    return files.some(f => path.basename(f) == 'RedAlert.dll');
}

export function isRulesMod(instructions: IInstruction[]): boolean {
    return ((instructions.map(i => i.source).find(f => path.basename(f).toLowerCase() === 'rules.ini') !== undefined) || 
     (instructions.map(i => i.source).every(f => path.extname(f).toLowerCase() === '.ini')));
}

export function getUserModsPath(gameDir?: string) {
    return path.join(remote.app.getPath('documents'), 'CnCRemastered', 'Mods', gameDir ?? '');
}

export function getGamePath(api: IExtensionApi, game: IGame, useDataPath?: boolean) {
    const state = api.getState();
    const discovery = state.settings.gameMode.discovered[game.id];
    return useDataPath ? path.join(discovery.path, 'Data') : discovery.path;
}