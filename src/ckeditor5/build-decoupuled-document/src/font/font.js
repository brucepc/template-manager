import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class CustomFontStylesUI extends Plugin {
	init() {
		this.editor.ui.componentFactory.add('fontFamilyDropdown', () => {
			const editor = this.editor;
			const t = editor.t;

			const command = editor.commands.get('fontFamily');

			// Use original fontFamily button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontFamily');

			// Show label on dropdown's button.
			dropdownView.buttonView.set('withText', true);

			// To hide the icon uncomment below.
			dropdownView.buttonView.set('icon', false);

			// Bind dropdown's button label to fontFamily value.
			dropdownView.buttonView.bind('label').to(command, 'value', value => {
				// If no value is set on the command show 'Default' text.
				// Use t() method to make that string translatable.
				return value ? value : t('Fonte');
			});

			return dropdownView;
		});

		this.editor.ui.componentFactory.add('fontSizeDropdown', () => {
			const editor = this.editor;
			const t = editor.t;

			const command = editor.commands.get('fontSize');

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontSize');

			// Show label on dropdown's button.
			dropdownView.buttonView.set('withText', true);

			// To hide the icon uncomment below.
			dropdownView.buttonView.set('icon', false);

			// Bind dropdown's button label to fontSize value.
			dropdownView.buttonView.bind('label').to(command, 'value', value => {
				// If no value is set on the command show 'Default' text.
				// Use t() method to make that string translatable.
				return value ? `${value}pt` : t('16pt');
			});

			return dropdownView;
		});
	}
}
