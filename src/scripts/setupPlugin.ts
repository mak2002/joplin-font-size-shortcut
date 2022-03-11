import joplin from 'api';
import { SettingItemType } from 'api/types';
import { ChangeEvent } from 'api/JoplinSettings';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';
const fs = joplin.require('fs-extra');


export async function setupPlugin() {
    const installDir = await joplin.plugins.installationDir();		
    const chromeCssFilePath = installDir + '/note.css';
    // const noteCssFilePath = installDir + '/note.css';

    // await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
    // await (joplin as any).window.loadNoteCssFile(noteCssFilePath);

    await joplin.settings.registerSection('ShortCuts', {
        label: 'Font Size Shortcut',
        iconName: 'fas fa-palette',
        description: 'Increase Font Size: Cmd/Ctrl + Shift + ] \n Decrease Font Size: Cmd/Ctrl + Shift + [',
    });

    let customFontSize: number;

    // register settings
    await joplin.settings.registerSettings({
        'customFontSize' : {
            label: 'Custom Font Size',
            type: SettingItemType.Int,
            section: 'ShortCuts',
            value: customFontSize,
            public: true,
        },
        'sessionOnly' : {
            label: 'Use Font Size for this session only?',
            type: SettingItemType.Bool,
            section: 'ShortCuts',
            value: true,
            public: true,
        }
    })

    console.log("-----just testing-----")

    // returns css with incremented value
    async function returnUpdatedCSS(incrementValue: number): Promise<string> {
        customFontSize += incrementValue;
        console.log('customFontSize: ',customFontSize);
        await joplin.settings.setValue('customFontSize', customFontSize); 
        const CSSstr = `.CodeMirror {
            font-size: ${customFontSize}px !important;
        }`
        return CSSstr;
    }

    // returns css with custom font size
    async function cssFromCustomValue(incrementedValue: number): Promise<string> {
        const CSSstr = `.CodeMirror {
            font-size: ${incrementedValue}px !important;
        }`
        return CSSstr;
    }

    // apply updated css to chrome css 
    async function UseUpdatedCSS(incrementValue: number) {
        const updatedCSS = await returnUpdatedCSS(incrementValue);
        await fs.writeFile(chromeCssFilePath, updatedCSS, 'utf8');
        await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
        const note = await joplin.workspace.selectedNote();

        let newNoteBody = note.body;
        await joplin.commands.execute("textSelectAll");
        await joplin.commands.execute("replaceSelection", newNoteBody);
    }

    await joplin.commands.register({
        name: 'increaseFontSize',
        label: 'Increase Editor Font Size',
        iconName: 'fas fa-plus-circle',
        execute: async () => {
            UseUpdatedCSS(1);
        },
    });
    
    await joplin.commands.register({
        name: 'decreaseFontSize',
        label: 'Decrease Editor Font Size',
        iconName: 'fas fa-minus-circle',
        execute: async () => {
            UseUpdatedCSS(-1);
        },
    });

    await joplin.settings.onChange(async (event: ChangeEvent) => {
        console.log(event.keys);
        const value = await joplin.settings.value(event.keys[0]);

        const cssStr = await cssFromCustomValue(value);
        await fs.writeFile(chromeCssFilePath, cssStr, 'utf8');
        await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
        
        console.log("value change: ",value, cssStr);
    })

    let isSessionOnly: boolean = await joplin.settings.value('sessionOnly');
    let defaultFontSize: number = await joplin.settings.globalValue('style.editor.fontSize');

    // await joplin.workspace.onNoteChange(async (event) => {
    //     console.log("-----Note change event-----",event);
    //     const tempStr = await cssFromCustomValue(customFontSize);
    //     await fs.writeFile(chromeCssFilePath, tempStr, 'utf8');
    //     await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
    // })

    // checking if font size is set to season only
    if(isSessionOnly) {
        // if it is season only then reset to default editor font size
        await joplin.settings.setValue('customFontSize', defaultFontSize);
        customFontSize = defaultFontSize;
        let tempStr = await cssFromCustomValue(defaultFontSize);

        await fs.writeFile(chromeCssFilePath, tempStr, 'utf8');
        await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);

        console.log('-----testing this function-----', defaultFontSize, tempStr)
    } else {
        // else load font size from memory
        customFontSize = await joplin.settings.value('customFontSize');
        let tempStr = await cssFromCustomValue(customFontSize);

        await fs.writeFile(chromeCssFilePath, tempStr, 'utf8');
        await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
        console.log('-----testing this function-----', defaultFontSize, tempStr)

    }
    
    console.log('-----isSessionOnly-----',isSessionOnly);
    

    await joplin.views.toolbarButtons.create('increaseFontSizeButton', 'increaseFontSize', ToolbarButtonLocation.EditorToolbar);
    await joplin.views.toolbarButtons.create('decreaseFontSizeButton', 'decreaseFontSize', ToolbarButtonLocation.EditorToolbar);

    await joplin.views.menuItems.create('myMenuItem1', 'increaseFontSize', MenuItemLocation.Tools, { accelerator: 'CmdOrCtrl+Shift+]' });
    await joplin.views.menuItems.create('myMenuItem2', 'decreaseFontSize', MenuItemLocation.Tools, { accelerator: 'CmdOrCtrl+Shift+[' });
}