import { Node, mergeAttributes } from '@tiptap/core';

export interface PoetryOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        poetry: {
            setPoetry: () => ReturnType;
            togglePoetry: () => ReturnType;
        };
    }
}

export const Poetry = Node.create<PoetryOptions>({
    name: 'poetry',

    group: 'block',

    content: 'text*',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="poetry"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, { 'data-type': 'poetry', class: 'poetry-block' }),
            0,
        ];
    },

    addCommands() {
        return {
            setPoetry:
                () =>
                    ({ commands }) => {
                        return commands.setNode(this.name);
                    },
            togglePoetry:
                () =>
                    ({ commands }) => {
                        return commands.toggleNode(this.name, 'paragraph');
                    },
        };
    },
});
