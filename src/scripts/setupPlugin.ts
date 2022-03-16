import joplin from 'api';
import { SettingItemType } from 'api/types';
import { ChangeEvent } from 'api/JoplinSettings';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';
const fs = joplin.require('fs-extra');


export async function setupPlugin() {
    const installDir = await joplin.plugins.installationDir();		
    const chromeCssFilePath = installDir + '/chrome.css';
    
    await joplin.settings.registerSection('ShortCuts', {
        label: 'Custom Font Size',
        iconName: 'fas fa-palette',
    });

    let customFontSize: number;
    let changeFactor: number;
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
        },
        'changeFactor' : {
            label: 'Change Factor',
            type: SettingItemType.Int,
            section: 'ShortCuts',
            value: 1,
            public: true,
        }
    })

    // write custom css and load it in app
    async function writeAndLoadCSS(CSS:string) {
        await fs.writeFile(chromeCssFilePath, CSS, 'utf8')
        await joplin.window.loadChromeCssFile(chromeCssFilePath);
        await joplin.commands.execute('editor.execCommand', {
            name: 'refresh',
            args: [],
        })
    }

    // returns css with custom font size
    async function cssFromCustomValue(incrementedValue: number) {
        const CSSstr = `.CodeMirror {
            font-size: ${incrementedValue}px !important;
        }`
        return CSSstr;
    }

    // compare new css with the local one and then load the css 
    async function compareCSSAndApply(newCSS:string): Promise<void> {

        fs.readFile(chromeCssFilePath, 'utf8', async function(err:string, data) {
            if (err) throw err;
            // compare old CSS(data) with newCSS
            if(data !== newCSS) {
                await writeAndLoadCSS(newCSS)
            }
        })
    }

    // apply updated css to chrome css 
    async function executeFontChange(changeValue: number) {
        
        const currentCustomFont = await joplin.settings.value('customFontSize');
        await joplin.settings.setValue('customFontSize', currentCustomFont + changeValue)
        await compareCSSAndApply(`.CodeMirror {
            font-size: ${currentCustomFont + changeValue}px !important;
        }`)
        await joplin.commands.execute('editor.execCommand', {
            name: 'refresh',
            args: [],
        })
    }

    await joplin.commands.register({
        name: 'increaseFontSize',
        label: 'Increase Editor Font Size',
        iconName: 'fas fa-plus-circle',
        execute: async () => {
            await executeFontChange(changeFactor);
        },
    });
    
    await joplin.commands.register({
        name: 'decreaseFontSize',
        label: 'Decrease Editor Font Size',
        iconName: 'fas fa-minus-circle',
        execute: async () => {
            await executeFontChange(-changeFactor);
        },
    });
    
    await joplin.settings.onChange(async (event: ChangeEvent) => {
    
        // currently whenever we change font size with shortcut, then this function is also triggered 
        // causing 1 unnecessary function call, but as we compare it doesn't execute 
        if(event.keys[0] === 'customFontSize') {
            const value = await joplin.settings.value(event.keys[0]);
            const cssStr = await cssFromCustomValue(value);
            await compareCSSAndApply(cssStr);
        } 
        else if (event.keys[0] === 'changeFactor') {
            changeFactor = await joplin.settings.value(event.keys[0]);
        }
        
    });

    let isSessionOnly: boolean = await joplin.settings.value('sessionOnly');
    let defaultFontSize: number = await joplin.settings.globalValue('style.editor.fontSize');
    changeFactor = await joplin.settings.value('changeFactor');

    // checking if font size is set to session only
    // if it is session only then reset to default editor font size
    if(isSessionOnly) {

        await joplin.settings.setValue('customFontSize', defaultFontSize);
        const defaultFontSizeCSS:string = await cssFromCustomValue(defaultFontSize);
        await writeAndLoadCSS(defaultFontSizeCSS);
        

    } else {
        // else load font size from memory
        let customFontSize:number = await joplin.settings.value('customFontSize');
        const customFontSizeCSS:string = await cssFromCustomValue(customFontSize);
        await writeAndLoadCSS(customFontSizeCSS);
    }

    await joplin.views.toolbarButtons.create('increaseFontSizeButton', 'increaseFontSize', ToolbarButtonLocation.EditorToolbar);
    await joplin.views.toolbarButtons.create('decreaseFontSizeButton', 'decreaseFontSize', ToolbarButtonLocation.EditorToolbar);

    await joplin.views.menuItems.create('myMenuItem1', 'increaseFontSize', MenuItemLocation.Tools, { accelerator: 'CmdOrCtrl+Shift+]' });
    await joplin.views.menuItems.create('myMenuItem2', 'decreaseFontSize', MenuItemLocation.Tools, { accelerator: 'CmdOrCtrl+Shift+[' });
}