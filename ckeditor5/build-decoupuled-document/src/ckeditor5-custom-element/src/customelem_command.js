import Command from '@ckeditor/ckeditor5-core/src/command';
//import { findOptimalInsertionPosition} from '@ckeditor/ckeditor5-widget/src/utils';



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

        // if (!this.isValid()) { return; }

        this.onCreate(this.tagName).then(attrs => {
            if (attrs !== null) {
                const model = this.editor.model;
                console.log(attrs);

                model.change(writer => {

                    const elem = writer.createElement(this.tagName, attrs);
                    writer.appendText(this.placeholder.repeat(attrs.maxChar), elem);

                    const insertAtSelection = model.document.selection.getFirstPosition();
                    model.insertContent(elem, insertAtSelection);

                    if (elem.parent) {
                        writer.setSelection(elem, 'on');
                    }
                });
            }
        });
    };

    isValid() {
        return this.onCreate instanceof Promise;
    }
}





