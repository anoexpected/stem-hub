// Extension Test Script
// Paste this into the browser console to test extensions

console.log('🔧 Testing Tiptap Extensions...\n');

// Helper to get editor instance
function getEditor() {
    const editorElement = document.querySelector('.ProseMirror');
    if (!editorElement) {
        console.error('❌ Editor not found!');
        return null;
    }
    // The editor instance should be attached to the element or accessible via React
    console.log('✅ Editor element found');
    return editorElement;
}

// Test commands (run these one by one in console)
const tests = {
    button: () => {
        console.log('Testing Button extension...');
        console.log('Run: editor.chain().focus().setButton({ text: "Test", url: "https://test.com" }).run()');
    },

    poll: () => {
        console.log('Testing Poll extension...');
        console.log('Run: editor.chain().focus().setPoll({ question: "Test?", options: ["A", "B", "C"] }).run()');
    },

    footnote: () => {
        console.log('Testing Footnote extension...');
        console.log('Run: editor.chain().focus().setFootnote({ number: 1, text: "Test note" }).run()');
    },

    financialChart: () => {
        console.log('Testing Financial Chart extension...');
        console.log('Run: editor.chain().focus().setFinancialChart({ symbol: "AAPL", type: "candlestick" }).run()');
    },

    poetry: () => {
        console.log('Testing Poetry extension...');
        console.log('Run: editor.chain().focus().togglePoetry().run()');
    },

    latex: () => {
        console.log('Testing LaTeX insertion...');
        console.log('Run: editor.chain().focus().insertContent("$E = mc^2$").run()');
    }
};

// Check if custom styles are loaded
function checkStyles() {
    console.log('\n📋 Checking CSS...');

    const styles = {
        '.button-wrapper': 'Button styles',
        '.poll-widget': 'Poll styles',
        '.footnote': 'Footnote styles',
        '.financial-chart-widget': 'Financial Chart styles',
        '.poetry-block': 'Poetry styles',
        '.video-embed': 'Video embed styles'
    };

    Object.entries(styles).forEach(([selector, name]) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.log(`✅ ${name} - ${elements.length} found`);
        } else {
            console.log(`⚠️  ${name} - Not found (might not be inserted yet)`);
        }
    });
}

// Check if extensions are in the HTML
function checkInsertedExtensions() {
    console.log('\n📊 Checking inserted extensions...');

    const checks = [
        { selector: '[data-type="button"]', name: 'Buttons' },
        { selector: '[data-type="poll"]', name: 'Polls' },
        { selector: '[data-type="footnote"]', name: 'Footnotes' },
        { selector: '[data-type="financial-chart"]', name: 'Financial Charts' },
        { selector: '[data-type="poetry"]', name: 'Poetry blocks' },
        { selector: '.video-embed', name: 'Videos' }
    ];

    checks.forEach(({ selector, name }) => {
        const count = document.querySelectorAll(selector).length;
        if (count > 0) {
            console.log(`✅ ${name}: ${count}`);
        } else {
            console.log(`⚠️  ${name}: 0 (use More menu to insert)`);
        }
    });
}

// Run all checks
console.log('🚀 Starting tests...\n');
getEditor();
checkStyles();
checkInsertedExtensions();

console.log('\n📝 To test extensions, use the More menu in the toolbar');
console.log('Or run individual tests: tests.button(), tests.poll(), etc.');

// Export for easy access
window.editorTests = tests;
window.checkExtensions = () => {
    checkStyles();
    checkInsertedExtensions();
};

console.log('\n✅ Test script loaded!');
console.log('💡 Type "checkExtensions()" to re-run checks');
console.log('💡 Type "tests.button()" to see button test command');
