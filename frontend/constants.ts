
import { Product, Lot, MovementType, Partner, PartnerType, Sale, Payable, FinancialAccount, FinancialTransaction } from './types';

export const VAT_RATE = 0.22; // 22%
const today = new Date().toISOString().split('T')[0];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P1', name: 'Mela Fuji', category: 'Frutta', unit: 'KG', variety: 'Fuji', caliber: '75/80', tareWeight: 0 },
  { id: 'P2', name: 'Pera Abate', category: 'Frutta', unit: 'KG', variety: 'Abate Fetel', caliber: '65/70', tareWeight: 0 },
  { id: 'P3', name: 'Arancia Tarocco', category: 'Agrumi', unit: 'KG', variety: 'Tarocco', caliber: '4', tareWeight: 0 },
  { id: 'P4', name: 'Patata Agria', category: 'Ortaggi', unit: 'KG', variety: 'Agria', caliber: '50+', tareWeight: 0 },
  { id: 'P5', name: 'Bietola', category: 'Ortaggi', unit: 'KG', variety: 'Costa', caliber: 'Standard', tareWeight: 0 },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'CUST-001', name: 'Ristorante La Brace', vat: '12345678901', type: PartnerType.CUSTOMER, address: 'Via Roma 1, Milano', email: 'labrace@email.com', phone: '02123456' },
  { id: 'CUST-002', name: 'Supermercato Fresco & Co', vat: '09876543211', type: PartnerType.CUSTOMER, address: 'Via Garibaldi 10, Milano', email: 'fresco@email.com', phone: '02654321' },
  { id: 'PROD-GINO', name: 'Azienda Agricola Gino', vat: '55566677711', type: PartnerType.PRODUCER, address: 'Cascina Bella 2, Lodi', email: 'gino@email.com', phone: '037198765' },
  { id: 'SUPP-001', name: 'Ortofrutta Import Srl', vat: '11122233344', type: PartnerType.SUPPLIER, address: 'Via del Mercato 5, Verona', email: 'import@email.com', phone: '045112233' },
];

export const MOCK_LOTS: Lot[] = [
  {
    id: 'L2024-001',
    productId: 'P1',
    partnerId: 'SUPP-001', // Fornitore
    entryDate: '2024-05-10',
    initialCost: 0.85,
    ssn: 'TRAC-9988',
    status: 'ACTIVE',
    grossWeight: 500,
    tareWeight: 12.5,
    currentQuantity: 350,
    acquisitionType: 'PURCHASE',
    quality: 'I',
    packaging: 'Cassa Legno 10kg',
    numberOfPackages: 50,
    tarePerPackage: 0.25,
    purchasePaymentStatus: 'UNPAID',
    movements: [
      { id: 'M1', lotId: 'L2024-001', companyId: 'C1', quantity: 487.5, type: MovementType.IN, date: '2024-05-10', user: 'M. Rossi', reason: 'Carico da fattura ACQ01' },
      { id: 'M2', lotId: 'L2024-001', companyId: 'C1', quantity: -100, type: MovementType.OUT, date: '2024-05-11', user: 'L. Verdi', reason: 'Vendita DDT 101' },
      { id: 'M3', lotId: 'L2024-001', companyId: 'C1', quantity: -37.5, type: MovementType.OUT, date: '2024-05-12', user: 'L. Verdi', reason: 'Vendita DDT 105' },
    ]
  },
  {
    id: 'L2024-002',
    productId: 'P5',
    partnerId: 'PROD-GINO', // Produttore Gino
    entryDate: today,
    initialCost: 0, // Costo a zero per C/V
    ssn: 'TRAC-9989',
    status: 'ACTIVE',
    grossWeight: 150,
    tareWeight: 7.5,
    currentQuantity: 142.5,
    acquisitionType: 'CONSIGNMENT',
    quality: 'I',
    packaging: 'Cassa Legno 15kg',
    commissionRate: 15,
    numberOfPackages: 10,
    tarePerPackage: 0.75,
    movements: [
      { id: 'M4', lotId: 'L2024-002', companyId: 'C1', quantity: 142.5, type: MovementType.IN, date: today, user: 'M. Rossi', reason: 'Carico C/V da Gino' },
    ]
  },
  // ... other lots
];

export const MOCK_SALES: Sale[] = [
  { id: 'SALE-001', customerId: 'CUST-001', lotId: 'L2024-001', numberOfPackages: 10, quantity: 100, price: 1.20, saleDate: '2024-05-11', paymentTerms: 'Contanti', additionalTare: 0, subtotal: 120, vatAmount: 26.4, totalAmount: 146.4, status: 'COMPLETED', actualWeight: 100.5, paymentStatus: 'PAID', amountPaid: 146.4, deliveryStatus: 'DELIVERED', documentType: 'FATTURA', documentId: 'FA2024-001' },
  { id: 'SALE-002', customerId: 'CUST-002', lotId: 'L2024-001', numberOfPackages: 5, quantity: 50, price: 1.15, saleDate: '2024-05-12', paymentTerms: 'Ri.Ba. 60gg', additionalTare: 2, subtotal: 55.2, vatAmount: 12.14, totalAmount: 67.34, status: 'COMPLETED', actualWeight: 50.2, paymentStatus: 'UNPAID', amountPaid: 0, deliveryStatus: 'DELIVERED' },
  { id: 'SALE-TODAY-1', customerId: 'CUST-001', lotId: 'L2024-002', numberOfPackages: 2, quantity: 30, price: 0.90, saleDate: today, paymentTerms: 'Contanti', additionalTare: 0, subtotal: 27, vatAmount: 5.94, totalAmount: 32.94, status: 'COMPLETED', actualWeight: 30.1, paymentStatus: 'UNPAID', amountPaid: 0, deliveryStatus: 'PENDING' },
  { id: 'SALE-TODAY-2', customerId: 'CUST-002', lotId: 'L2024-002', numberOfPackages: 3, quantity: 45, price: 0.88, saleDate: today, paymentTerms: 'Contanti', additionalTare: 0, subtotal: 39.6, vatAmount: 8.71, totalAmount: 48.31, status: 'PENDING_PICKING', paymentStatus: 'UNPAID', amountPaid: 0, deliveryStatus: 'PENDING' },
  { id: 'SALE-TODAY-3', customerId: 'CUST-001', lotId: 'L2024-002', numberOfPackages: 1, quantity: 15, price: 0.92, saleDate: today, paymentTerms: 'Contanti', additionalTare: 0, subtotal: 13.8, vatAmount: 3.04, totalAmount: 16.84, status: 'COMPLETED', actualWeight: 15.2, paymentStatus: 'PARTIALLY_PAID', amountPaid: 10, deliveryStatus: 'PENDING' },
];

export const MOCK_ACCOUNTS: FinancialAccount[] = [
  { id: 'ACC-BANK-1', name: 'Banca Intesa Sanpaolo', balance: 125430.50, type: 'BANK' },
  { id: 'ACC-CASH-1', name: 'Cassa Principale', balance: 7345.80, type: 'CASH' },
];

export const MOCK_PAYABLES: Payable[] = [
  { id: 'PAY-001', partnerId: 'SUPP-001', amount: 414.38, dueDate: '2024-06-10', status: 'UNPAID', creationDate: '2024-05-10', description: 'Fattura Acquisto per lotto L2024-001', relatedLotIds: ['L2024-001'] },
];

export const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'TR-001', accountId: 'ACC-CASH-1', amount: 16.84, type: 'IN', date: today, description: 'Incasso parziale da Ristorante La Brace', relatedId: 'SALE-TODAY-3' },
  { id: 'TR-002', accountId: 'ACC-BANK-1', amount: 500, type: 'OUT', date: '2024-05-20', description: 'Pagamento utenze', relatedId: 'UTIL-001' },
];


export const SQL_DDL = `
-- DDL per Tabella Partner
CREATE TABLE core_partner (
    id VARCHAR(50) PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES core_company(id),
    name VARCHAR(255) NOT NULL,
    vat_number VARCHAR(20) UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('FORNITORE', 'CLIENTE', 'PRODUTTORE', 'VETTORE')),
    address TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partner_type ON core_partner(type);
CREATE INDEX idx_partner_name ON core_partner(name);

-- DDL per Tabella Lot
CREATE TABLE core_lot (
    id VARCHAR(50) PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES core_product(id),
    partner_id VARCHAR(50) NOT NULL REFERENCES core_partner(id), -- Produttore o Fornitore
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    initial_cost DECIMAL(12, 4) NOT NULL, -- A zero per il Conto Vendita
    ssn_code VARCHAR(100) UNIQUE,
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'CLOSED', 'DEPLETED', 'QUARANTINE')),
    gross_weight DECIMAL(10, 2) DEFAULT 0,
    tare_weight DECIMAL(10, 2) DEFAULT 0, -- Tara totale calcolata
    -- Campi specifici del Modulo Market
    acquisition_type VARCHAR(20) NOT NULL CHECK (acquisition_type IN ('PURCHASE', 'CONSIGNMENT')),
    quality VARCHAR(10), -- 'I', 'II', 'Extra'
    packaging VARCHAR(100),
    commission_rate DECIMAL(5, 2), -- Tasso di commissione per C/V
    number_of_packages INTEGER,
    tare_per_package DECIMAL(10, 3),
    purchase_payment_status VARCHAR(20) CHECK (purchase_payment_status IN ('UNPAID', 'PAID')),
    settlement_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ... other DDLs
`;
