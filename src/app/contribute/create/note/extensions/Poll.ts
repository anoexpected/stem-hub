import { Node, mergeAttributes } from '@tiptap/core';

export interface PollOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        poll: {
            setPoll: (options: { question: string; options: string[] }) => ReturnType;
        };
    }
}

export const Poll = Node.create<PollOptions>({
    name: 'poll',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            question: {
                default: 'Your question here?',
            },
            options: {
                default: ['Option 1', 'Option 2', 'Option 3'],
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="poll"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, { 'data-type': 'poll', class: 'poll-widget' }),
            [
                'div',
                { class: 'poll-question' },
                HTMLAttributes.question,
            ],
            [
                'div',
                { class: 'poll-options' },
                ...HTMLAttributes.options.map((option: string, index: number) => [
                    'div',
                    { class: 'poll-option', 'data-index': index },
                    [
                        'input',
                        {
                            type: 'radio',
                            name: 'poll',
                            id: `poll-option-${index}`,
                        },
                    ],
                    [
                        'label',
                        { for: `poll-option-${index}` },
                        option,
                    ],
                ]),
            ],
        ];
    },

    addCommands() {
        return {
            setPoll:
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
