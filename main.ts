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
				var line = 0
				console.log(line)
				console.log(editor.getLine(line))
				if (editor.getLine(line) == "---") {
					line = 1
					while (editor.getLine(line) != '---' && line <= editor.lastLine()) {
						console.log(line)
						console.log(editor.getLine(line))		
						line += 1
					}
					line += 2
				}
				const pos : EditorPosition = {
					line: line,
					ch: 0
				}
				editor.replaceRange(this.settings.header,
									pos)
			}
		});
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InsertHeaderSettingTab(this.app, this));



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

		containerEl.createEl('h2', {text: 'Insert Header plubgin.'});

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
