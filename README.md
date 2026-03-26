# 🍏 FruttaGest Suite

Benvenuti nel repository di **FruttaGest Suite**, l'ecosistema gestionale moderno ed elegante sviluppato per rivoluzionare l'amministrazione dei mercati ortofrutticoli all'ingrosso. 

## 🎯 Obiettivo e Pubblico di Riferimento

**FruttaGest Suite** è progettata specificamente per **grossisti, commissionari e distributori ortofrutticoli**. Il suo compito principale è semplificare e automatizzare il complesso flusso di lavoro quotidiano: dall'ingresso della merce in magazzino (tramite lotti e partite), passando per la vendita giornaliera (al dettaglio e all'ingrosso), fino ad arrivare alla gestione contabile (fatturazione ai clienti e liquidazioni ai fornitori/produttori in conto vendita).

L'interfaccia utente è studiata seguendo una rigorosa visione architetturale focalizzata su un'**estetica "Apple Feel"**: pulita, interattiva, dotata di micro-animazioni fluide e design glassmorphism, per garantire che ogni interazione non sia solo funzionale, ma anche un'esperienza premium per l'operatore aziendale.

---

## 🚀 Funzionalità Implementate (Stato Attuale)

### 🎨 Frontend & Design System
- **Stack Tecnologico:** React, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Estetica Premium:** Tema chiaro/scuro ottimizzato, sfondi con profondità (backdrop-blur), layout focalizzati sull'utente senza rumore visivo.
- **Struttura a Moduli:** Architettura a schede per passare facilmente tra le sezioni (Dashboard, Catalogo, Market, Contatti).
- **Autenticazione "Sliding Monolith":** Sistema di accesso e registrazione unificato con animazioni fisiche a molla, design glassmorphic e recupero password integrato.

### 📦 Gestione Market (Lotti e Vendite)
- **Registro Giornaliero (Daily Sales Journal):** Visualizzazione dei lotti attivi a magazzino, con barra di avanzamento visiva (colli iniziali vs colli venduti). 
- **Assegnazione Interattiva:** Sistema Drag-and-Drop per assegnare rapidamente le vendite concluse ai rispettivi lotti. 
- **Gestione "C/Vendita" e "Acquisto":** Differenziazione visiva chiara tra le partite acquisite.

### 👥 CRM Contatti
- **Gestione Clienti, Fornitori e Produttori:** Viste divise per ruolo, con schede di dettaglio eleganti (eliminazione del rumore visivo, design "deep glass").
- **Modalità di Modifica Inline:** Possibilità di aggiornare i contatti direttamente dall'interfaccia senza ricaricare la pagina.

### 💰 Contabilità Clienti & Fatturazione
- Riepilogo intelligente delle vendite, agganciato dinamicamente ai clienti del giorno.
- Modalità di generazione per: **Pagamenti Diretti, Riepilogo DDT, Fatturazione, Scontrino Elettronico.**
- Identificazione immediata dello stato pagamenti (Pagato, Non Pagato, Parzialmente Pagato).

### 📊 Liquidazione Fornitori (Settlement)
- Visualizzazione tabellare per l'analisi del riepilogo merce per partita.
- **Riepilogo Istantaneo:** Componente visuale e accessibile che mostra i ricavi lordi, applicazione automatica della percentuale di provvigione e ricavo netto destinato ai partner. Include anche grafici interattivi di analisi delle vendite.
- Reso Merce: Moduli per registrare il ritiro dell'invenduto da parte del fornitore.

### ⚙️ Backend & Database
- **Stack Tecnologico:** Node.js, Express, Prisma ORM.
- **Database:** Definizione di uno schema robusto (Prodotti, Partner, Lotti, Vendite). Attualmente configurato in migrazione verso **MySQL** (es. Aruba) al posto di SQLite per supportare accessi multi-utente concorrenti.

---

## 🚧 Cosa Dobbiamo Ancora Fare (Roadmap)

Nonostante l'avanzato stato dell'interfaccia grafica, occorre completare l'integrazione e la robustezza del sistema "dietro le quinte":

1. **Integrazione Backend Completa per il "Wizard di Vendita":**
   - Implementare le API Express per permettere la creazione reale di nuove vendite (con calcolo tara, pesi e registrazione transazioni nel DB).
   - Connettere il frontend in modo stabile agli endpoint al posto del mock dei dati.

2. **Finalizzazione Motore Contabile (API Account & Documenti):**
   - Creazione degli endpoint per salvare, aggiornare e tracciare le fatture (FATTURA), i DDT (Documenti di Trasporto) e gli Scontrini.
   - Registrazione definitiva delle liquidazioni (Settlements) ai fornitori nel database.

3. **Integrazione Database Remoto (MySQL su Aruba):**
   - Finalizzare l'inserimento delle credenziali nel file `.env`, fare il `push` del Prisma Schema su MySQL remoto e connettere definitivamente l'applicazione, abbandonando il database locale/mocking.

4. **Risoluzione Errori d'Ambiente Locale (sandbox-exec):**
   - Investigare e fixare l'errore sistemico di PowerShell/Windows `sandbox-exec non riconosciuto` per garantire un flusso di build/dev (`npm run dev`/`build`) limpido e senza intoppi sul terminale di sviluppo frontend locale.

5. **Polish, UX Assoluta & QA:**
   - Rafforzare i controlli di accessibilità (QA & Accessibility Agent).
   - Inserimento Skeleton Screens e feedback asincroni (Toast/Sonner) durante le comunicazioni tra Frontend e RestAPI. 
   - Ottimizzazione delle performance delle animazioni Framer Motion su dispositivi datati.

---
*Progetto curato e assistito da Antigravity OS - Ecosistema Multi-Agente AI.*
