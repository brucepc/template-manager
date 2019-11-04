import Command from '@ckeditor/ckeditor5-core/src/command';


export class CustomElemCommand extends Command {

	constructor(editor, tagName, placeholder, inline, attributes, onCreate) {
		super(editor);

		this.tagName = tagName;
		this.placeholder = placeholder;
		this.attributes = attributes;
		this.inline = inline;
		this.onCreate = onCreate;
	};


	execute() {
		let oncreate = this.onCreate(this.tagName);
		console.log('Oncreate');

		if (oncreate instanceof Promise) {
			oncreate.then(attrs => {
				if (attrs !== null) {
					const model = this.editor.model;
					model.change(writer => {
						const elem = writer.createElement(this.tagName, attrs);
						const insertAtSelection = model.document.selection.getFirstPosition();
						writer.appendText(this.placeholder.repeat(attrs.maxChar), elem);
						model.insertContent(elem, insertAtSelection);

						if (elem.parent) {
							writer.setSelection(elem, 'on');
						}
					});
				}
			});
		}
	};
}
