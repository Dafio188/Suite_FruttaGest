const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'images', 'products');
const targetDir = path.join(__dirname, 'frontend', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

let files = [];
try {
    files = fs.readdirSync(sourceDir);
} catch (e) {
    console.log("Error reading source dir", e);
    process.exit(1);
}

const products = files.map(file => {
    const ext = path.extname(file);
    const nameWithoutExt = path.basename(file, ext);

    // Format the name nicely (capitalize words, replace hyphens/underscores with spaces)
    const readableName = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    // Copy file
    try {
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
    } catch (err) {
        console.error(`Failed to copy ${file}:`, err);
    }

    return {
        name: readableName,
        imageFileName: file,
        originalFileName: nameWithoutExt
    };
});

fs.writeFileSync(path.join(__dirname, 'products_list.json'), JSON.stringify(products, null, 2));
console.log(`Processed ${products.length} images.`);
