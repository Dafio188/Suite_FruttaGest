import express from 'express';
import { prisma } from './db.js';

const router = express.Router();

const mapPartnerToDb = (p) => {
    let dbType = 'BOTH';
    if (p.type === 'CLIENTE') dbType = 'CUSTOMER';
    if (p.type === 'FORNITORE' || p.type === 'PRODUTTORE' || p.type === 'VETTORE') dbType = 'SUPPLIER';

    return {
        // id: p.id - do not include id in create to let cuid() work if needed, or if provided, pass it.
        ...(p.id ? { id: p.id } : {}),
        type: dbType,
        name: p.name,
        vatNumber: p.vat,
        taxId: p.type, // Store original frontend type here to prevent data loss
        address: p.address,
        email: p.email,
        phone: p.phone,
    };
};

const mapPartnerToFrontend = (dbP) => {
    return {
        id: dbP.id,
        type: dbP.taxId || (dbP.type === 'CUSTOMER' ? 'CLIENTE' : 'FORNITORE'),
        name: dbP.name,
        vat: dbP.vatNumber || '',
        address: dbP.address || '',
        email: dbP.email || '',
        phone: dbP.phone || '',
    };
};

// --- PARTNERS API ---
router.get('/partners', async (req, res) => {
    try {
        const dbPartners = await prisma.partner.findMany();
        res.json(dbPartners.map(mapPartnerToFrontend));
    } catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/partners', async (req, res) => {
    try {
        const partner = await prisma.partner.create({ data: mapPartnerToDb(req.body) });
        res.json(mapPartnerToFrontend(partner));
    } catch (error) {
        console.error("Error creating partner:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/partners/:id', async (req, res) => {
    try {
        const partner = await prisma.partner.update({
            where: { id: req.params.id },
            data: mapPartnerToDb(req.body)
        });
        res.json(mapPartnerToFrontend(partner));
    } catch (error) {
        console.error("Error updating partner:", error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/partners/:id', async (req, res) => {
    try {
        const partner = await prisma.partner.delete({
            where: { id: req.params.id }
        });
        res.json(mapPartnerToFrontend(partner));
    } catch (error) {
        console.error("Error deleting partner:", error);
        res.status(500).json({ error: error.message });
    }
});


// --- LOTS API ---
router.get('/lots', async (req, res) => {
    try {
        const lots = await prisma.lot.findMany({
            include: { supplier: true, product: true }
        });
        res.json(lots);
    } catch (error) {
        console.error("Error fetching lots:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/lots', async (req, res) => {
    try {
        const lot = await prisma.lot.create({ data: req.body });
        res.json(lot);
    } catch (error) {
        console.error("Error creating lot:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- PRODUCTS API ---
router.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        // Dynamically append imageUrl checking the public folder since DB schema lacks it
        const targetDir = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'products');
        let files = [];
        try { files = fs.readdirSync(targetDir); } catch (e) { }

        const productsWithImages = products.map(p => {
            // Reverse engineering the readableName logic
            const likelyMatches = files.filter(f => {
                const ext = path.extname(f);
                const nameWithoutExt = path.basename(f, ext);
                const readableName = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return readableName === p.name || nameWithoutExt.toLowerCase() === p.name.toLowerCase();
            });

            return {
                ...p,
                imageUrl: likelyMatches.length > 0 ? `/images/products/${likelyMatches[0]}` : null
            };
        });

        res.json(productsWithImages);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const product = await prisma.product.create({ data: req.body });
        res.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- SALES API ---
router.get('/sales', async (req, res) => {
    try {
        const sales = await prisma.sale.findMany({
            include: { customer: true, lot: true }
        });
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/sales', async (req, res) => {
    try {
        const { customerId, lotId, numberOfPackages, quantity, price, additionalTare, subtotal, totalAmount } = req.body;

        // Transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            const lot = await tx.lot.findUnique({ where: { id: lotId } });
            if (!lot) throw new Error("Lot not found");

            // Wait, we should reduce the currentQuantity and packages
            if (lot.numberOfPackages < numberOfPackages) throw new Error("Not enough packages in lot");

            const sale = await tx.sale.create({
                data: {
                    customerId,
                    lotId,
                    numberOfPackages,
                    orderedQuantity: quantity,
                    unitPrice: price,
                    additionalTare: additionalTare || 0,
                    totalAmount: totalAmount || subtotal,
                    status: 'COMPLETED'
                }
            });

            await tx.lot.update({
                where: { id: lotId },
                data: {
                    numberOfPackages: { decrement: numberOfPackages },
                    currentQuantity: { decrement: quantity }
                }
            });
            return sale;
        });

        res.json(result);
    } catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/sales/:id', async (req, res) => {
    try {
        const sale = await prisma.sale.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(sale);
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/sales/:id', async (req, res) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({ where: { id: req.params.id } });
            if (!sale) throw new Error("Sale not found");

            await tx.lot.update({
                where: { id: sale.lotId },
                data: {
                    numberOfPackages: { increment: sale.numberOfPackages },
                    currentQuantity: { increment: sale.orderedQuantity }
                }
            });

            const deletedSale = await tx.sale.delete({ where: { id: req.params.id } });
            return deletedSale;
        });

        res.json(result);
    } catch (error) {
        console.error("Error deleting sale:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- ACCOUNTING API ---
router.post('/account/action', async (req, res) => {
    try {
        const { saleIds, action } = req.body; // action can be 'PAY', 'DDT', 'INVOICE', 'SCONTRINO'

        const updateData = {};
        if (action === 'PAY') {
            updateData.paymentStatus = 'PAID';
            // In a real scenario we might also calculate full amountPaid here
            // But we can simplify for demonstration.
        } else if (['DDT', 'INVOICE', 'SCONTRINO'].includes(action)) {
            updateData.documentType = action;
            updateData.documentId = `${action}-` + Math.floor(Math.random() * 1000000); // Mock document generation
        }

        const result = await prisma.sale.updateMany({
            where: { id: { in: saleIds } },
            data: updateData
        });

        res.json({ message: "Accounting action applied successfully", result });
    } catch (error) {
        console.error("Error applying accounting action:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/account/settlement', async (req, res) => {
    try {
        const { partnerId, netAmount, lotIds } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const settlementId = "SETT-" + Math.floor(Math.random() * 1000000);

            // 1. Create a Payable entry for this partner
            const payable = await tx.payable.create({
                data: {
                    partnerId: partnerId,
                    amount: netAmount,
                    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days due
                    description: `Liquidazione C/V lotti: ${lotIds.join(', ')}`,
                    status: 'UNPAID'
                }
            });

            // 2. Mark the lots as settled
            await tx.lot.updateMany({
                where: { id: { in: lotIds } },
                data: {
                    settlementId: settlementId,
                    purchasePaymentStatus: 'PAID'
                }
            });

            return { payable, settlementId };
        });

        res.json({ message: "Settlement created successfully", result });
    } catch (error) {
        console.error("Error creating settlement:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- SEED DATABASE MOCK ---
router.get('/seed', async (req, res) => {
    try {
        // 1. Create a mock product
        const product = await prisma.product.create({
            data: {
                name: 'Mele Golden',
                category: 'Frutta',
                unit: 'Kg',
                tareWeight: 1.5,
            }
        });

        // 2. Create a mock supplier
        const supplier = await prisma.partner.create({
            data: {
                name: 'Azienda Agricola Rossi',
                type: 'SUPPLIER',
            }
        });

        // 3. Create a lot
        const lot = await prisma.lot.create({
            data: {
                lotNumber: 'L2024-' + Date.now(),
                supplierId: supplier.id,
                productId: product.id,
                type: 'COMMISSION',
                initialQuantity: 1000,
                currentQuantity: 1000,
            }
        });

        res.json({ message: "Database seeded successfully!", lot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SYNC PRODUCTS FROM LOCAL IMAGES ---
import fs from 'fs';
import path from 'path';

router.get('/sync-products', async (req, res) => {
    try {
        const sourceDir = path.join(process.cwd(), '..', 'images', 'products');
        const targetDir = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'products');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        if (!fs.existsSync(sourceDir)) {
            return res.status(404).json({ error: `Directory images/products non trovata: ${sourceDir}` });
        }

        const files = fs.readdirSync(sourceDir).filter(f => f.match(/\.(png|jpe?g|webp|gif|svg)$/i));

        const productsCreated = [];

        for (const file of files) {
            const ext = path.extname(file);
            const nameWithoutExt = path.basename(file, ext);

            // Format name nicely
            const readableName = nameWithoutExt
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            // Copy file to next public dir
            try {
                fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
            } catch (err) {
                console.error(`Failed to copy ${file}:`, err);
            }

            // Check if product exists, if not create it
            const existing = await prisma.product.findFirst({
                where: { name: readableName }
            });

            if (!existing) {
                const newProduct = await prisma.product.create({
                    data: {
                        name: readableName,
                        category: 'Generico',
                        unit: 'Kg',
                        tareWeight: 1.0,
                        imageUrl: `/images/products/${file}` // assuming schema supports or we will migrate, wait Prisma schema might crash if imageUrl doesn't exist
                    }
                }).catch(async () => {
                    // Fallback if imageUrl column doesn't exist in Prisma Schema 
                    return await prisma.product.create({
                        data: {
                            name: readableName,
                            category: 'Generico',
                            unit: 'Kg',
                            tareWeight: 1.0
                        }
                    });
                });
                productsCreated.push(newProduct);
            }
        }

        res.json({ message: "Sincronizzazione completata", totalProcessed: files.length, newProductsAdded: productsCreated.length, added: productsCreated });
    } catch (error) {
        console.error("Error syncing products:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
