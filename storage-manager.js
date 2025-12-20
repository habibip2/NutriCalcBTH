/**
 * NutriCalc BTH - Storage Manager
 * Mengelola semua interaksi localStorage secara terpusat.
 */

const StorageManager = {
    // Konfigurasi Kunci Penyimpanan
    KEYS: {
        USER_PREFIX: 'user_data_',
        PORSI: 'porsi_history',
        GIZI: 'nutrition_history',
        SESSION: 'isLoggedIn',
        ACTIVE_USER: 'activeUser'
    },

    // 1. Managemen Riwayat (Umum)
    saveHistory: function(key, newData, limit = 20) {
        try {
            let history = this.getHistory(key);
            history.unshift({
                ...newData,
                id: Date.now(),
                waktu: new Date().toLocaleString('id-ID')
            });
            
            // Optimasi: Batasi jumlah data agar browser tetap ringan
            if (history.length > limit) history.pop();
            
            localStorage.setItem(key, JSON.stringify(history));
            return true;
        } catch (e) {
            console.error("Gagal menyimpan ke localStorage:", e);
            return false;
        }
    },

    getHistory: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    deleteItem: function(key, id) {
        let history = this.getHistory(key);
        history = history.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(history));
    },

    clearAll: function(key) {
        localStorage.removeItem(key);
    },

    // 2. Managemen User
    registerUser: function(username, password) {
        const userData = { username, password };
        localStorage.setItem(this.KEYS.USER_PREFIX + username, JSON.stringify(userData));
    },

    loginUser: function(username, password) {
        const storedData = localStorage.getItem(this.KEYS.USER_PREFIX + username);
        if (storedData) {
            const user = JSON.parse(storedData);
            if (user.password === password) {
                sessionStorage.setItem(this.KEYS.SESSION, 'true');
                sessionStorage.setItem(this.KEYS.ACTIVE_USER, username);
                return true;
            }
        }
        return false;
    }
};
