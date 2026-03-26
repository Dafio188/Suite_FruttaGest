
export enum PartnerType {
  SUPPLIER = 'FORNITORE',
  CUSTOMER = 'CLIENTE',
  PRODUCER = 'PRODUTTORE',
  CARRIER = 'VETTORE'
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  WASTE = 'SCARTO',
  ADJUSTMENT = 'RETTIFICA',
  RETURN = 'RESO_FORNITORE'
}

export enum EventType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  WASTE = 'WASTE',
  HARVEST = 'HARVEST'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: 'KG' | 'COLLI' | 'PEZZI' | string;
  variety?: string;
  caliber?: string;
  tareWeight?: number;
  imageUrl?: string;
}

export interface StockMovement {
  id: string;
  lotId: string;
  companyId: string;
  quantity: number;
  type: MovementType;
  date: string;
  documentLineId?: string;
  user: string;
  reason: string;
}

export interface Lot {
  id: string;
  productId: string;
  partnerId: string; // Producer or Supplier
  entryDate: string;
  initialCost: number; // 0 for consignment
  ssn: string;
  status: 'ACTIVE' | 'CLOSED' | 'DEPLETED' | 'QUARANTINE' | 'RETURNED';
  grossWeight: number; // Peso Lordo in KG
  tareWeight: number; // Peso Tara Totale calcolato
  currentQuantity: number; // Quantità attuale (peso netto)
  movements: StockMovement[];
  // New fields for Market Module
  acquisitionType: 'PURCHASE' | 'CONSIGNMENT';
  quality: 'I' | 'II' | 'Extra';
  packaging: string; // e.g., "Cassa Legno", "Mazzi", "Pezzi"
  commissionRate?: number; // Only for CONSIGNMENT
  numberOfPackages: number;
  tarePerPackage: number;
  purchasePaymentStatus?: 'UNPAID' | 'PAID';
  settlementId?: string;
}

export interface Partner {
  id: string;
  name: string;
  vat: string;
  type: PartnerType;
  address: string;
  email: string;
  phone: string;
}

export interface Sale {
  id: string;
  customerId: string;
  lotId: string;
  numberOfPackages: number;
  quantity: number; // Peso lordo stimato/negoziato
  price: number;
  saleDate: string;
  paymentTerms: string;
  additionalTare: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: 'PENDING_PICKING' | 'COMPLETED';
  actualWeight?: number; // Peso lordo effettivo dopo pesatura
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  amountPaid: number;
  deliveryStatus: 'PENDING' | 'PARTIAL' | 'DELIVERED';
  documentType?: 'DDT' | 'FATTURA' | 'SCONTRINO';
  documentId?: string;
}

export interface Payable {
  id: string;
  partnerId: string;
  amount: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID';
  paymentMethod?: 'Bonifico' | 'Assegno' | 'Contanti';
  paymentReference?: string;
  creationDate: string;
  paymentDate?: string;
  description: string;
  relatedLotIds: string[];
}

export interface Receivable {
  id: string;
  customerId: string;
  amount: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID';
  creationDate: string;
  relatedSaleId: string;
}

export interface FinancialAccount {
  id: string;
  name: string;
  balance: number;
  type: 'BANK' | 'CASH';
}

export interface FinancialTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'IN' | 'OUT';
  date: string;
  description: string;
  relatedId?: string; // Payable or Receivable ID
}

export interface BusinessEvent {
  id: string;
  timestamp: string;
  companyId: string;
  moduleOrigin: 'PRO' | 'MARKET' | 'RETAIL';
  eventType: EventType;
  partnerId: string;
  productId: string;
  lotId: string;
  quantity: number;
  grossAmount: number;
  netMargin: number;
  costAtTime: number;
}

export interface MarginCalculation {
  salePrice: number;
  purchaseCost: number;
  logisticsCost: number;
  weightLoss: number;
  netWeight: number;
  realMargin: number;
}
