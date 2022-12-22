import { App, Editor, EditorPosition, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface InsertHeaderSettings {
	header: string;
}

const DEFAULT_SETTINGS: InsertHeaderSettings = {
	header: `
topics:
tags:
links:

---
	`
}

export default class InsertHeaderPlugin extends Plugin {
	settings: InsertHeaderSettings;

	async onload() {
		await this.loadSettings();


		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'insert-header-command',
			name: 'Insert Header',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				const pos : EditorPosition = {
					line: 0,
					ch: 0
				}
				editor.replaceRange(this.settings.header,
									pos)
			}
		});
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InsertHeaderSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class InsertHeaderSettingTab extends PluginSettingTab {
	plugin: InsertHeaderPlugin;

	constructor(app: App, plugin: InsertHeaderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Header')
			.setDesc('This is the header that will be inserted into the current note')
			.addTextArea(text => text
				.setPlaceholder('Header text')
				.setValue(this.plugin.settings.header)
				.onChange(async (value) => {
					console.log('Header: ' + value);
					this.plugin.settings.header = value;
					await this.plugin.saveSettings();
				}));
	}
}
