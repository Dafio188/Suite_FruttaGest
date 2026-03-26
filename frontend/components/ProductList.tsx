import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit, Package, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
    products: Product[];
    onSaveProduct: (p: Product) => void;
    onDeleteProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSaveProduct, onDeleteProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/sync-products');
            if (res.ok) {
                const data = await res.json();
                alert(`Sincronizzazione completata! Aggiunti ${data.newProductsAdded} nuovi prodotti.`);
                // Assuming we need to refresh the products list, we could pass a callback
                // For now the user can just wait for auto-refresh or we can trigger it
                window.location.reload();
            } else {
                alert("Errore durante la sincronizzazione.");
            }
        } catch (err) {
            console.error(err);
            alert("Errore di connessione.");
        } finally {
            setIsSyncing(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Package className="h-6 w-6 text-emerald-600" />
                    Rubrica Prodotti
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sincronizza Immagini
                    </button>
                    {/* Futuro: pulsante per aggiungere un nuovo prodotto manualmente */}
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca per nome o categoria..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white/50 backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto pb-10">
                {filteredProducts.map((product: Product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <Package className="h-12 w-12 text-slate-300" />
                            )}
                            {/* Overlay actions */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        if (confirm(`Sei sicuro di voler eliminare ${product.name}?`)) {
                                            onDeleteProduct(product.id);
                                        }
                                    }}
                                    className="p-1.5 bg-white/90 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 shadow-sm transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="text-xs font-semibold text-emerald-600 mb-1 uppercase tracking-wider">{product.category}</div>
                            <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{product.name}</h3>
                            <div className="mt-2 text-sm text-slate-500 flex justify-between items-center">
                                <span>Unit: <span className="font-medium text-slate-700">{product.unit}</span></span>
                                <span>Tara: <span className="font-medium text-slate-700">{product.tareWeight} kg</span></span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-600">Nessun prodotto trovato</h3>
                        <p className="text-slate-500 mt-2">Prova a cercare con un altro termine o assicurati di aver importato le immagini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
