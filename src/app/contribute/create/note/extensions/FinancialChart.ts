import { Node, mergeAttributes } from '@tiptap/core';

export interface FinancialChartOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        financialChart: {
            setFinancialChart: (options: { symbol: string; type: string }) => ReturnType;
        };
    }
}

export const FinancialChart = Node.create<FinancialChartOptions>({
    name: 'financialChart',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            symbol: {
                default: 'AAPL',
            },
            type: {
                default: 'candlestick',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="financial-chart"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                'data-type': 'financial-chart',
                class: 'financial-chart-widget',
                'data-symbol': HTMLAttributes.symbol,
                'data-chart-type': HTMLAttributes.type,
            }),
            [
                'div',
                { class: 'chart-placeholder' },
                `Financial Chart: ${HTMLAttributes.symbol} (${HTMLAttributes.type})`,
            ],
        ];
    },

    addCommands() {
        return {
            setFinancialChart:
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
