import { Node, mergeAttributes } from '@tiptap/core';

export interface ButtonOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        button: {
            setButton: (options: { text: string; url: string }) => ReturnType;
        };
    }
}

export const Button = Node.create<ButtonOptions>({
    name: 'button',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            text: {
                default: 'Click here',
            },
            url: {
                default: '#',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="button"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, { 'data-type': 'button', class: 'button-wrapper' }),
            [
                'a',
                {
                    href: HTMLAttributes.url,
                    class: 'editor-button',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                HTMLAttributes.text,
            ],
        ];
    },

    addCommands() {
        return {
            setButton:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});
