import { Node, mergeAttributes } from '@tiptap/core';

export interface FootnoteOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        footnote: {
            setFootnote: (options: { number: number; text: string }) => ReturnType;
        };
    }
}

export const Footnote = Node.create<FootnoteOptions>({
    name: 'footnote',

    group: 'inline',

    inline: true,

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            number: {
                default: 1,
            },
            text: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'sup[data-type="footnote"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'sup',
            mergeAttributes(this.options.HTMLAttributes, { 'data-type': 'footnote', class: 'footnote' }),
            ['a', { href: `#fn${HTMLAttributes.number}`, class: 'footnote-ref' }, `[${HTMLAttributes.number}]`],
        ];
    },

    addCommands() {
        return {
            setFootnote:
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
